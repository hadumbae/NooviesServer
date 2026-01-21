/**
 * @file AggregateQueryService.types.ts
 *
 * Shared type definitions for {@link AggregateQueryService}.
 */

import type {FilterQuery} from "mongoose";
import type {QueryOptionParams} from "../../schema/query/QueryOptionParamsSchema.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages
} from "../../types/mongoose/AggregatePipelineStages.js";

/**
 * Pagination configuration for aggregate-capable queries.
 */
export type AggregatePaginationOptions =
    | { paginated: true, page: number, perPage: number }
    | { paginated?: false, page?: never, perPage?: never };

/**
 * Result shape returned by query execution.
 */
export type AggregateQueryResults<TResult = any> =
    TResult[] | { totalItems: number; items: TResult[] };

/**
 * Parameters for aggregate-capable queries.
 */
export type AggregateQueryParams<TSchema = Record<string, unknown>, TMatchFilters = any> =
    Omit<QueryOptionParams, "paginated"> &
    AggregatePaginationOptions & {
    options: QueryOptionTypes<TSchema, TMatchFilters>;
    populationPipelines?: PopulationPipelineStages;
};

/**
 * Parameters for non-paginated `.find()` queries.
 */
export type FindQueryParams<TSchema = Record<string, unknown>, TMatchFilters = any> =
    Omit<QueryOptionParams, "paginated"> & {
    options: QueryOptionTypes<TSchema, TMatchFilters>;
};

/**
 * Parameters for paginated `.find()` queries.
 */
export type PaginatedQueryParams<TSchema = Record<string, unknown>, TMatchFilters = any> =
    FindQueryParams<TSchema, TMatchFilters> & {
    page: number;
    perPage: number;
};

/**
 * Parameters used when counting documents via aggregation.
 */
export type CountQueryParams<TMatchFilters> = {
    matchFilters?: FilterQuery<TMatchFilters>;
    referenceFilters?: ReferenceFilterPipelineStages;
};
