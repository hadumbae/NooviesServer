import type {AggregateCountParams, AggregateQueryParams, AggregateQueryResults} from "./AggregateQueryService.types.js";
import type {Model, PipelineStage, SortOrder} from "mongoose";
import type {PopulatePath} from "../../types/PopulatePath.js";
import type IAggregateQueryService from "./IAggregateQueryService.js";
import buildAggregationSort from "../../utility/buildAggregationSort.js";

/**
 * A reusable query service supporting both `.find()` and `.aggregate()` queries
 * with optional population, pagination, and document counting.
 *
 * Provides a consistent interface for retrieving Mongoose documents
 * with flexible query options.
 *
 * @typeParam TSchema - The schema type of the documents in the collection.
 */
export default class AggregateQueryService<TSchema = Record<string, any>> implements IAggregateQueryService<TSchema> {
    private readonly _model: Model<TSchema>;
    private readonly _populateRefs: PopulatePath[];

    /**
     * Creates a new AggregateQueryService instance.
     *
     * @param model - The Mongoose model to query.
     * @param populateRefs - Optional default population paths for `.find()` queries.
     */
    constructor({model, populateRefs = []}: { model: Model<TSchema>; populateRefs?: PopulatePath[] }) {
        this._model = model;
        this._populateRefs = populateRefs;
    }

    /**
     * Executes a query using either `.aggregate()` or `.find()` depending on the presence of reference filters or population pipelines.
     *
     * @param params - Query parameters including match filters, population pipelines, sorting, and pagination.
     * @typeParam TResult - The type of the returned documents.
     * @returns Aggregated or standard query results, either as a list or a paginated object.
     */
    async query<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {referenceFilters, populationPipelines} = params;
        const useAggregate = referenceFilters?.length || populationPipelines?.length;
        return useAggregate ? this.aggregate(params) : this.find(params);
    }

    /**
     * Executes a standard `.find()` query with optional population, pagination, and `.lean()` support.
     *
     * @param params - Query parameters including match filters, sorts, population, pagination, and virtuals.
     * @typeParam TResult - The type of the returned documents.
     * @returns A list of matching documents or a paginated object containing `totalItems` and `items`.
     */
    async find<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {
            matchFilters = {},
            querySorts = {},
            populate,
            limit,
            virtuals = false,
            paginated,
            page,
            perPage,
        } = params;

        const query = this._model
            .find(matchFilters)
            .sort(querySorts as Record<string, SortOrder>);

        if (!paginated && limit) query.limit(limit);
        if (paginated) query.skip(perPage * (page - 1)).limit(perPage);
        if (populate) query.populate(this._populateRefs);
        if (virtuals) query.lean(virtuals && {virtuals: true});

        if (paginated) {
            return {
                totalItems: await this._model.countDocuments(matchFilters),
                items: (await query) as TResult[],
            };
        }

        return (await query) as TResult[];
    }

    /**
     * Executes an aggregation pipeline with optional `$match`, reference filters, population stages, sorting, and pagination.
     *
     * @param params - Aggregation parameters including filters, population pipelines, sorting, and pagination.
     * @typeParam TResult - The type of the returned documents.
     * @returns A list of aggregated documents or a paginated object containing `totalItems` and `items`.
     */
    async aggregate<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {
            matchFilters,
            referenceFilters,
            querySorts,
            limit,
            paginated,
            populationPipelines = [],
            populate,
        } = params;

        const pipeline: PipelineStage[] = [];

        if (matchFilters) pipeline.push({$match: matchFilters});
        if (referenceFilters) pipeline.push(...referenceFilters);
        if (querySorts) pipeline.push({$sort: buildAggregationSort(querySorts as Record<string, SortOrder>)});

        if (paginated) {
            const {page, perPage} = params;
            pipeline.push({$skip: (page - 1) * perPage});
            pipeline.push({$limit: perPage});
        }

        if (!paginated && typeof limit === "number") pipeline.push({$limit: limit});
        if (populate) pipeline.push(...populationPipelines);

        if (paginated) {
            return {
                totalItems: await this.count(params),
                items: (await this._model.aggregate(pipeline).exec()) as TResult[],
            };
        }

        return (await this._model.aggregate(pipeline).exec()) as TResult[];
    }

    /**
     * Counts the number of documents matching the given filters using an aggregation pipeline.
     *
     * @param params - Count parameters including `matchFilters` and optional `referenceFilters`.
     * @returns The number of matching documents.
     *
     * @example
     * ```ts
     * const total = await aggregateService.count({
     *   matchFilters: { isActive: true },
     *   referenceFilters: [ *** some $lookup stages ****]
     * });
     * console.log(total); // e.g., 42
     * ```
     */
    async count(params: AggregateCountParams): Promise<number> {
        const {matchFilters, referenceFilters} = params;

        const pipeline: PipelineStage[] = [];

        if (matchFilters) pipeline.push({$match: matchFilters});
        if (referenceFilters) pipeline.push(...referenceFilters);
        pipeline.push({$count: "docCount"});

        const aggregate = await this._model.aggregate(pipeline);

        return aggregate[0]?.docCount ?? 0;
    }
}
