/**
 * @file AggregateQueryService.types.ts
 *
 * Shared type definitions for {@link AggregateQueryService}.
 *
 * Defines constructor parameters, query inputs, pagination behavior,
 * and result shapes for aggregation-based query execution.
 */

import type {Model, PipelineStage} from "mongoose";
import type {QueryOptionParams} from "../../schema/query/QueryOptionParamsSchema.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {
    PopulationPipelineStages,
    VirtualPipelineStages,
} from "../../types/mongoose/AggregatePipelineStages.js";
import type {ModelObject} from "../../types/ModelObject.js";

/**
 * Public query interface exposed by {@link AggregateQueryService}.
 *
 * @template TSchema - Base Mongoose schema shape
 * @template TMatchFilters - Shape of allowed `$match` filters
 */
export interface AggregateQueryMethods<TSchema extends ModelObject, TMatchFilters = any> {
    /**
     * Execute a query using either a standard `.find()` query
     * or an aggregation pipeline, depending on the provided options.
     *
     * @template TResult - Final result document shape
     */
    query<TResult = any>(
        params: AggregateQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>>;
}

/**
 * Constructor parameters for {@link AggregateQueryService}.
 *
 * @template TSchema - Base Mongoose schema shape for the target model
 */
export type AggregateConstructorParams<TSchema extends ModelObject> = {
    /** Mongoose model used as the aggregation root */
    model: Model<TSchema>;

    /** Pipeline stages used to populate reference fields */
    populationPipelines?: PopulationPipelineStages;

    /** Pipeline stages used to materialize virtual or derived fields */
    virtualsPipelines?: VirtualPipelineStages;
};

/**
 * Pagination configuration for aggregate-capable queries.
 *
 * Enforces mutual exclusivity between paginated and non-paginated modes.
 */
export type AggregatePaginationOptions =
    | { paginated: true; page: number; perPage: number }
    | { paginated?: false; page?: never; perPage?: never };

/**
 * Parameters for aggregate-capable queries.
 *
 * Combines generic query options with aggregation-aware pagination
 * and strongly-typed filtering and sorting configuration.
 *
 * @template TSchema - Base schema shape used for query option typing
 * @template TMatchFilters - Shape of allowed `$match` filters
 */
export type AggregateQueryParams<TSchema extends ModelObject, TMatchFilters = any> =
    Omit<QueryOptionParams, "paginated"> & AggregatePaginationOptions & {
    /** Query options translated into aggregation pipeline stages */
    options: QueryOptionTypes<TSchema, TMatchFilters>;
};

/**
 * Parameters required for paginated aggregation execution.
 *
 * Used internally once the aggregation pipeline has been fully composed.
 */
export type AggregatePaginatedParams =
    Pick<QueryOptionParams, "virtuals" | "populate"> & {
    /** Fully composed aggregation pipeline */
    pipeline: PipelineStage[];

    /** Current page index (1-based) */
    page: number;

    /** Maximum items per page */
    perPage: number;
};

/**
 * Result shape returned by aggregate query execution.
 *
 * - Returns a flat array for non-paginated queries
 * - Returns total count metadata when pagination is enabled
 *
 * @template TResult - Final aggregation output shape
 */
export type AggregateQueryResults<TResult = any> =
    | TResult[]
    | { totalItems: number, items: TResult[] };
