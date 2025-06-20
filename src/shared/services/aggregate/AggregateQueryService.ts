import type {AggregateCountParams, AggregateQueryParams, AggregateQueryResults} from "./AggregateQueryServiceTypes.js";
import type {Model, PipelineStage} from "mongoose";
import type {PopulatePath} from "../../types/PopulatePath.js";
import type IAggregateQueryService from "./IAggregateQueryService.js";

/**
 * A reusable query service that supports both `.find()` and `.aggregate()` operations
 * with optional population, pagination, and count.
 */
export default class AggregateQueryService<TSchema = Record<string, any>> implements IAggregateQueryService<TSchema> {
    private readonly _model: Model<TSchema>;
    private readonly _populateRefs: PopulatePath[];

    /**
     * Creates a new AggregateQueryService instance.
     *
     * @param model - The Mongoose model to query.
     * @param populateRefs - Default population paths for `.find()` queries.
     */
    constructor({model, populateRefs}: { model: Model<TSchema>, populateRefs: PopulatePath[] }) {
        this._model = model;
        this._populateRefs = populateRefs;
    }

    /**
     * Chooses between `.aggregate()` and `.find()` based on the presence of `populateFilters`.
     *
     * @param params - Query parameters including filters, population, and pagination.
     * @returns Aggregated or standard query results.
     */
    async query<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {populateFilters} = params;

        if (populateFilters?.length) {
            return this.aggregate(params);
        }

        return this.find(params);
    }

    /**
     * Executes a standard `.find()` query with optional `.populate()` and `.lean()`.
     * Supports both paginated and non-paginated responses.
     *
     * @param params - Query parameters including filters, pagination, and population options.
     * @returns A list of matching documents or a paginated result.
     */
    async find<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {
            matchFilters = {},
            populate,
            limit,
            virtuals = false,
            paginated,
            page,
            perPage,
        } = params;

        const query = this._model.find(matchFilters);

        if (!paginated && limit) query.limit(limit);
        if (paginated) query.skip(perPage * (page - 1)).limit(perPage);
        if (populate) query.populate(this._populateRefs);

        if (paginated) {
            return {
                totalItems: await this._model.countDocuments(matchFilters),
                items: (await query.lean(virtuals)) as TResult[],
            };
        }

        return (await query.lean(virtuals)) as TResult[];
    }

    /**
     * Executes an aggregation pipeline with `$match`, population stages, and optional pagination.
     *
     * @param params - Aggregation parameters including match, populate stages, and pagination.
     * @returns A list of aggregated documents or a paginated result.
     */
    async aggregate<TResult = any>(params: AggregateQueryParams): Promise<AggregateQueryResults<TResult>> {
        const {
            matchFilters = {},
            populateFilters = [],
            limit,
            paginated,
            populatePipelines = [],
            populate,
        } = params;

        const pipeline: PipelineStage[] = [];

        pipeline.push({$match: matchFilters});
        pipeline.push(...populateFilters);

        if (paginated) {
            const {page, perPage} = params;

            pipeline.push({$skip: (page - 1) * perPage});
            pipeline.push({$limit: perPage});
        }

        if (!paginated && typeof limit === "number") pipeline.push({$limit: limit});
        if (populate) pipeline.push(...populatePipelines);

        if (paginated) {
            return {
                totalItems: await this.count(params),
                items: (await this._model.aggregate(pipeline).exec()) as TResult[],
            }
        }

        return (await this._model.aggregate(pipeline).exec()) as TResult[];
    }

    /**
     * Counts the number of documents that match the given filters via aggregation.
     *
     * @param params - Count parameters including match and population filters.
     * @returns The number of matching documents.
     */
    async count(params: AggregateCountParams): Promise<number> {
        const {matchFilters, populateFilters} = params;

        const pipeline: PipelineStage[] = [];

        if (matchFilters) pipeline.push({$match: matchFilters});
        if (populateFilters) pipeline.push(...populateFilters);
        pipeline.push({$count: "docCount"});

        const aggregate = await this._model.aggregate(pipeline);

        return aggregate[0]?.docCount ?? 0;
    }
}