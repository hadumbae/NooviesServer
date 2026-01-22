/**
 * @file AggregateQueryService.ts
 *
 * Generic query service that transparently supports both Mongoose `.find()`
 * and `.aggregate()` execution paths.
 *
 * The service automatically selects the optimal strategy:
 * - Uses `.find()` for simple match filters and root-level sorting
 * - Falls back to `.aggregate()` when reference filters or reference-based
 *   sorting are required
 *
 * Features:
 * - Unified filtering and sorting API
 * - Reference-aware querying via aggregation pipelines
 * - Optional population support
 * - Pagination with total document counts
 * - Lean document handling with virtuals
 *
 * Designed to act as a shared infrastructure layer for repositories and
 * admin-facing query endpoints.
 */

import type {
    AggregateQueryParams,
    AggregateQueryResults,
    CountQueryParams,
    FindQueryParams,
    PaginatedQueryParams,
} from "./AggregateQueryService.types.js";
import type {Model, PipelineStage, SortOrder} from "mongoose";
import type {PopulatePath} from "../../types/mongoose/PopulatePath.js";
import buildAggregationSort from "../../utility/mongoose/buildAggregationSort.js";
import type {AggregateQueryMethods} from "./AggregateQueryService.interface.js";
import type {
    QueryMatchOptions,
    QueryReferenceOptions,
} from "../../types/query-options/QueryOptionService.types.js";

/**
 * Generic query service with automatic `.find()` vs `.aggregate()` selection.
 *
 * @template TSchema - Mongoose document schema shape
 * @template TMatchFilters - Supported match filter structure
 */
export default class AggregateQueryService<
    TSchema = Record<string, unknown>,
    TMatchFilters = any
> implements AggregateQueryMethods<TSchema, TMatchFilters> {
    /** Target Mongoose model */
    private readonly _model: Model<TSchema>;

    /** Default population paths for `.find()` queries */
    private readonly _populateRefs: PopulatePath[];

    /**
     * Create a new query service instance.
     *
     * @param model - Target Mongoose model
     * @param populateRefs - Default populate paths for `.find()` queries
     */
    constructor({model, populateRefs = []}: { model: Model<TSchema>, populateRefs?: PopulatePath[] }) {
        this._model = model;
        this._populateRefs = populateRefs;
    }

    /**
     * Execute a query using either `.find()` or `.aggregate()`.
     *
     * Aggregation is automatically selected when reference filters or
     * reference-based sorts are present.
     *
     * @template TResult - Returned document shape
     * @param params - Unified query parameters
     * @returns Query results or paginated results
     */
    async query<TResult = any>(
        params: AggregateQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>> {
        const {options: {reference}, paginated} = params;

        const useAggregate = Boolean(reference?.filters?.length || reference?.sorts?.length);

        if (useAggregate) {
            return this.aggregate(params);
        }

        return paginated ? this.paginated(params) : this.find(params);
    }

    /**
     * Execute a standard Mongoose `.find()` query.
     *
     * Supports:
     * - Root-level match filters
     * - Root-level sorting
     * - Population
     * - Lean documents with virtuals
     *
     * @template TResult - Returned document shape
     */
    async find<TResult = any>(
        {options: {match}, populate, limit, virtuals}: FindQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>> {
        const query = this._model
            .find(match?.filters ?? {})
            .sort((match?.sorts ?? {}) as Record<string, SortOrder>);

        if (limit) query.limit(limit);
        if (populate) query.populate(this._populateRefs);
        if (virtuals) query.lean({virtuals: true});

        return (await query) as TResult[];
    }

    /**
     * Execute a paginated `.find()` query.
     *
     * Returns both the paginated items and the total document count.
     *
     * @template TResult - Returned document shape
     */
    async paginated<TResult = any>(
        {options: {match}, populate, virtuals, page, perPage}: PaginatedQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>> {
        const query = this._model
            .find(match?.filters ?? {})
            .sort((match?.sorts ?? {}) as Record<string, SortOrder>)
            .skip(perPage * (page - 1))
            .limit(perPage);

        if (populate) query.populate(this._populateRefs);
        if (virtuals) query.lean({virtuals: true});

        return {
            totalItems: await this._model.countDocuments(match?.filters ?? {}),
            items: (await query) as TResult[],
        };
    }

    /**
     * Execute an aggregation pipeline query.
     *
     * Supports:
     * - `$match` filters
     * - Reference `$lookup` pipelines
     * - Reference-based sorting
     * - Pagination
     * - Population pipelines
     *
     * @template TResult - Returned document shape
     */
    async aggregate<TResult = any>(
        params: AggregateQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>> {
        const {options: {match, reference}, limit, populationPipelines, populate, paginated, virtuals} = params;

        const pipeline: PipelineStage[] = [];

        match && this.appendMatchOptions(pipeline, match);
        reference && this.appendReferenceOptions(pipeline, reference);

        if (paginated) {
            const {page, perPage} = params;
            pipeline.push({$skip: (page - 1) * perPage});
            pipeline.push({$limit: perPage});
        }

        if (!paginated && typeof limit === "number") {
            pipeline.push({$limit: limit});
        }

        if (populate) {
            pipeline.push(...(populationPipelines ?? []));
        }

        return paginated
            ? {
                items: (await this._model.aggregate(pipeline).option({virtuals})) as TResult[],
                totalItems: await this.count({
                    matchFilters: match?.filters,
                    referenceFilters: reference?.filters,
                }),
            }
            : ((await this._model.aggregate(pipeline).option({virtuals})) as TResult[]);
    }

    /**
     * Count documents using an aggregation pipeline.
     *
     * Applies the same match and reference filters used in aggregation queries.
     *
     * @param params.matchFilters - Root-level match filters
     * @param params.referenceFilters - Reference filter pipeline stages
     * @returns Total matching document count
     */
    async count(params: CountQueryParams<TMatchFilters>): Promise<number> {
        const {matchFilters, referenceFilters} = params;

        const pipeline: PipelineStage[] = [];

        if (matchFilters) pipeline.push({$match: matchFilters});
        if (referenceFilters) pipeline.push(...referenceFilters);
        pipeline.push({$count: "docCount"});

        const result = await this._model.aggregate(pipeline);

        return result[0]?.docCount ?? 0;
    }

    /**
     * Append `$match` and `$sort` stages to an aggregation pipeline.
     *
     * @param pipelines - Target pipeline array
     * @param options - Match and sort options
     */
    appendMatchOptions(
        pipelines: PipelineStage[],
        options: QueryMatchOptions<TSchema, TMatchFilters>
    ) {
        if (Object.keys(options.filters).length > 0) {
            pipelines.push({$match: options.filters});
        }

        if (Object.keys(options.sorts).length > 0) {
            pipelines.push({
                $sort: buildAggregationSort(
                    options.sorts as Record<string, SortOrder>
                ),
            });
        }

        return pipelines;
    }

    /**
     * Append reference filter and sort stages to an aggregation pipeline.
     *
     * @param pipelines - Target pipeline array
     * @param options - Reference filter and sort pipelines
     */
    appendReferenceOptions(
        pipelines: PipelineStage[],
        options: QueryReferenceOptions
    ) {
        if (options.filters.length > 0) pipelines.push(...options.filters);
        if (options.sorts.length > 0) pipelines.push(...options.sorts);

        return pipelines;
    }
}
