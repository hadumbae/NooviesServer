import type {AggregateCountParams, AggregateQueryParams, AggregateQueryResults} from "./AggregateQueryService.types.js";
import type {Model, PipelineStage, SortOrder} from "mongoose";
import type {PopulatePath} from "../../types/PopulatePath.js";
import type IAggregateQueryService from "./IAggregateQueryService.js";
import buildAggregationSort from "../../utility/buildAggregationSort.js";

/**
 * A reusable query service that supports both Mongoose `.find()` and `.aggregate()` queries,
 * with optional population, pagination, sorting, and document counting.
 *
 * Provides a consistent interface for retrieving documents with flexible query options.
 *
 * @typeParam TSchema - The schema type of the documents in the collection.
 * @typeParam TMatchFilters - The type representing filterable fields for `$match` stages.
 * @typeParam TReferenceFilters - The type representing reference-based filters (e.g. `$lookup` pipelines).
 */
export default class AggregateQueryService<
    TSchema = Record<string, unknown>,
    TMatchFilters = any,
    TReferenceFilters = any
> implements IAggregateQueryService<TSchema, TMatchFilters> {
    private readonly _model: Model<TSchema>;
    private readonly _populateRefs: PopulatePath[];

    /**
     * Creates a new {@link AggregateQueryService} instance.
     *
     * @param model - The Mongoose model to query.
     * @param populateRefs - Optional default population paths for `.find()` queries.
     */
    constructor({model, populateRefs = []}: { model: Model<TSchema>; populateRefs?: PopulatePath[] }) {
        this._model = model;
        this._populateRefs = populateRefs;
    }

    /**
     * Executes a query using either `.aggregate()` or `.find()`,
     * depending on whether reference filters or sorts are required.
     *
     * @typeParam TResult - The expected shape of the returned documents.
     * @param params - Query parameters including filters, pagination, and population options.
     * @returns Query results as an array or a paginated result object.
     */
    async query<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {options: {reference}} = params;
        const useAggregate = Boolean(reference?.filters?.length || reference?.sorts?.length);

        return useAggregate ? this.aggregate(params) : this.find(params);
    }

    /**
     * Executes a query using Mongoose `.find()` with optional population and pagination.
     *
     * @typeParam TResult - The expected shape of the returned documents.
     * @param params - Query parameters including filters, sorts, pagination, and population options.
     * @returns Query results as an array or a paginated result object.
     */
    async find<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {
            options: {match},
            populate,
            limit,
            virtuals = false,
            paginated,
            page,
            perPage,
        } = params;

        const {filters = {}, sorts = []} = match || {};

        const query = this._model
            .find(filters)
            .sort(sorts as Record<string, SortOrder>);

        if (!paginated && limit) query.limit(limit);
        if (paginated) query.skip(perPage * (page - 1)).limit(perPage);
        if (populate) query.populate(this._populateRefs);
        if (virtuals) query.lean(virtuals && {virtuals: true});

        if (paginated) {
            return {
                totalItems: await this._model.countDocuments(filters),
                items: (await query) as TResult[],
            };
        }

        return (await query) as TResult[];
    }

    /**
     * Executes a query using the aggregation pipeline API with optional filters, sorts,
     * population pipelines, and pagination.
     *
     * @typeParam TResult - The expected shape of the returned documents.
     * @param params - Aggregation parameters including `$match` filters, reference filters,
     *                 sorts, population pipelines, and pagination options.
     * @returns Query results as an array or a paginated result object.
     */
    async aggregate<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {
            options: {match, reference},
            limit,
            paginated,
            populationPipelines = [],
            populate,
        } = params;

        const {filters: matchFilters, sorts: matchSorts} = match || {};
        const {filters: referenceFilters, sorts: referenceSorts} = reference || {};

        const pipeline: PipelineStage[] = [];

        if (matchFilters) pipeline.push({$match: matchFilters});
        if (referenceFilters) pipeline.push(...referenceFilters);

        if (referenceSorts) pipeline.push(...referenceSorts);
        if (matchSorts && Object.keys(matchSorts).length > 0) {
            pipeline.push({$sort: buildAggregationSort(matchSorts as Record<string, SortOrder>)});
        }

        if (paginated) {
            const {page, perPage} = params;
            pipeline.push({$skip: (page - 1) * perPage});
            pipeline.push({$limit: perPage});
        }

        if (!paginated && typeof limit === "number") pipeline.push({$limit: limit});
        if (populate) pipeline.push(...populationPipelines);

        if (paginated) {
            return {
                totalItems: await this.count({matchFilters, referenceFilters}),
                items: (await this._model.aggregate(pipeline).exec()) as TResult[],
            };
        }

        return (await this._model.aggregate(pipeline).exec()) as TResult[];
    }

    /**
     * Counts documents matching the provided filters using an aggregation pipeline.
     *
     * @param params - Count parameters including `$match` and reference filters.
     * @returns The number of documents that match the provided filters.
     */
    async count(params: AggregateCountParams<TMatchFilters>): Promise<number> {
        const {matchFilters, referenceFilters} = params;

        const pipeline: PipelineStage[] = [];

        if (matchFilters) pipeline.push({$match: matchFilters});
        if (referenceFilters) pipeline.push(...referenceFilters);
        pipeline.push({$count: "docCount"});

        const aggregate = await this._model.aggregate(pipeline);

        return aggregate[0]?.docCount ?? 0;
    }
}
