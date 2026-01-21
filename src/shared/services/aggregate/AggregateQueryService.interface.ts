/**
 * @file AggregateQueryService.interface.ts
 *
 * Public interface for aggregate-capable query services.
 */

import type {
    AggregateQueryParams,
    AggregateQueryResults,
    FindQueryParams,
    PaginatedQueryParams
} from "./AggregateQueryService.types.js";

export interface AggregateQueryMethods<
    TSchema = Record<string, unknown>,
    TMatchFilters = any
> {
    /**
     * Execute a query using either `.find()` or `.aggregate()`.
     */
    query<TResult = any>(
        params: AggregateQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>>;

    /**
     * Execute a standard `.find()` query.
     */
    find<TResult = any>(
        params: FindQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>>;

    /**
     * Execute a paginated `.find()` query.
     */
    paginated<TResult = any>(
        params: PaginatedQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>>;

    /**
     * Execute an aggregation pipeline query.
     */
    aggregate<TResult = any>(
        params: AggregateQueryParams<TSchema, TMatchFilters>
    ): Promise<AggregateQueryResults<TResult>>;
}
