/**
 * @file AggregateQueryService.ts
 *
 * Generic query service that transparently supports aggregation-based
 * querying with reference-aware filtering, sorting, and pagination.
 *
 * Although inspired by `.find()` semantics, this service standardizes
 * all execution through MongoDB aggregation pipelines to enable:
 * - Reference-level filtering and sorting
 * - Virtual field materialization
 * - Consistent pagination with total counts
 *
 * Features:
 * - Unified filtering and sorting API
 * - Reference-aware querying via aggregation pipelines
 * - Optional population support
 * - Pagination with total document counts
 * - Lean document handling with optional virtuals
 *
 * Designed as a shared infrastructure layer for repositories and
 * admin-facing query endpoints.
 */

import type {
    AggregateConstructorParams,
    AggregatePaginatedParams,
    AggregateQueryMethods,
    AggregateQueryParams,
    AggregateQueryResults,
} from "./AggregateQueryService.types.js";
import type {Model, PipelineStage, SortOrder} from "mongoose";
import buildAggregationSort from "../../utility/mongoose/buildAggregationSort.js";
import type {
    QueryMatchOptions,
    QueryReferenceOptions,
} from "../../types/query-options/QueryOptionService.types.js";
import type {
    PopulationPipelineStages,
    VirtualPipelineStages,
} from "../../types/mongoose/AggregatePipelineStages.js";
import type {ModelObject} from "../../types/ModelObject.js";

/**
 * Generic aggregation-based query service.
 *
 * Provides a unified querying interface that supports:
 * - Root-level and reference-level filtering
 * - Reference-aware sorting
 * - Virtual field resolution
 * - Optional pagination with total counts
 *
 * @template TSchema - Base Mongoose document schema shape
 * @template TMatchFilters - Supported `$match` filter structure
 */
export default class AggregateQueryService<
    TSchema extends ModelObject,
    TMatchFilters = any
> implements AggregateQueryMethods<TSchema, TMatchFilters> {

    /** Target Mongoose model used as the aggregation root */
    private readonly _model: Model<TSchema>;

    /** Aggregation pipelines used to populate reference fields */
    private readonly _populationPipelines: PopulationPipelineStages;

    /** Aggregation pipelines used to materialize virtual or derived fields */
    private readonly _virtualsPipelines: VirtualPipelineStages;

    /**
     * Create a new {@link AggregateQueryService} instance.
     *
     * @param params - Constructor configuration
     */
    constructor(params: AggregateConstructorParams<TSchema>) {
        const {model, populationPipelines, virtualsPipelines} = params;

        this._model = model;
        this._populationPipelines = populationPipelines ?? [];
        this._virtualsPipelines = virtualsPipelines ?? [];
    }

    /**
     * Execute an aggregation-backed query.
     *
     * The aggregation pipeline is dynamically composed based on:
     * - Root-level match and sort options
     * - Reference-level filters and sorts
     * - Optional population and virtual pipelines
     * - Pagination configuration
     *
     * @template TResult - Final result document shape
     * @param params - Unified query parameters
     * @returns Query results or paginated result metadata
     */
    async query<TResult = any>(
        params: AggregateQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>> {
        const {
            options: {match, reference},
            limit,
            populate,
            paginated,
            virtuals,
        } = params;

        const pipeline: PipelineStage[] = [];

        match && this.appendMatchOptions(pipeline, match);
        reference && this.appendReferenceOptions(pipeline, reference);

        if (paginated) {
            const {page, perPage} = params;
            return this.paginated({pipeline, page, perPage, virtuals, populate});
        }

        if (typeof limit === "number") pipeline.push({$limit: limit});
        if (populate) pipeline.push(...this._populationPipelines);
        if (virtuals) pipeline.push(...this._virtualsPipelines);

        return this._model.aggregate(pipeline).option({virtuals});
    }

    /**
     * Execute a paginated aggregation query using `$facet`.
     *
     * Produces both:
     * - A paginated result set
     * - A total document count for pagination metadata
     *
     * @param params - Pagination execution parameters
     * @returns Paginated aggregation result
     */
    async paginated({pipeline, page, perPage, populate, virtuals}: AggregatePaginatedParams) {
        const itemPipelines = [
            {$skip: (page - 1) * perPage},
            {$limit: perPage},
            ...(populate ? this._populationPipelines : []),
            ...(virtuals ? this._virtualsPipelines : []),
        ];

        const paginatedPipelines: PipelineStage[] = [
            ...pipeline,
            {
                $facet: {
                    totalData: [{$count: "totalCount"}],
                    items: itemPipelines,
                },
            },
            {
                $project: {
                    totalItems: {$ifNull: [{$arrayElemAt: ["$totalData.totalCount", 0]}, 0]},
                    items: 1,
                },
            },
        ];

        const [result] = await this._model.aggregate(paginatedPipelines).option({virtuals});
        return result;
    }

    /**
     * Append root-level `$match` and `$sort` stages to an aggregation pipeline.
     *
     * @param pipelines - Target pipeline array
     * @param options - Match and sort configuration
     */
    appendMatchOptions(pipelines: PipelineStage[], options: QueryMatchOptions<TSchema, TMatchFilters>): void {
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
    }

    /**
     * Append reference-level filter and sort stages to an aggregation pipeline.
     *
     * These pipelines are assumed to already contain the required
     * `$lookup` and `$unwind` stages.
     *
     * @param pipelines - Target pipeline array
     * @param options - Reference filter and sort pipelines
     */
    appendReferenceOptions(pipelines: PipelineStage[], options: QueryReferenceOptions): void {
        if (options.filters.length > 0) pipelines.push(...options.filters);
        if (options.sorts.length > 0) pipelines.push(...options.sorts);
    }
}


