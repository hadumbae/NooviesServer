import type {AggregateQueryParams} from "./AggregateQueryService.types.js";

/**
 * Interface defining a service for executing aggregate and find queries
 * against a Mongoose model, with optional support for pagination,
 * population, and advanced query options.
 *
 * @typeParam TSchema - The schema type of the documents being queried.
 * @typeParam TMatchFilters - The type used for query match filters.
 */
export default interface IAggregateQueryService<
    TSchema = Record<string, unknown>,
    TMatchFilters = any,
> {
    /**
     * Executes a query, automatically choosing between a `.find()` or
     * `.aggregate()` pipeline depending on the provided options.
     *
     * @param params - Parameters including filters, sorts, pagination, and population pipelines.
     * @returns A promise resolving to query results or a paginated result object.
     */
    query(params: AggregateQueryParams<TSchema, TMatchFilters>): Promise<any>;

    /**
     * Executes a standard Mongoose `.find()` query with optional pagination,
     * sorting, population, and virtuals.
     *
     * @param params - Parameters including filters, sorts, pagination, and query options.
     * @returns A promise resolving to the documents or a paginated result object.
     */
    find(params: AggregateQueryParams<TSchema, TMatchFilters>): Promise<any>;

    /**
     * Executes an aggregation pipeline query, supporting advanced filters,
     * reference lookups, population, and pagination.
     *
     * @param params - Parameters including match filters, reference filters,
     * population pipelines, and pagination settings.
     * @returns A promise resolving to the aggregation results or a paginated result object.
     */
    aggregate(params: AggregateQueryParams<TSchema, TMatchFilters>): Promise<any>;
}
