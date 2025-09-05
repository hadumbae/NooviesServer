import type {AggregateQueryParams} from "./AggregateQueryService.types.js";

/**
 * Interface defining the contract for an aggregation query service.
 */
export default interface IAggregateQueryService<TSchema = Record<string, any>> {
    /**
     * Entry point for querying the database.
     * Automatically chooses between `find()` and `aggregate()` based on the presence of `populateFilters`.
     *
     * @param params - Query parameters including filters, pagination, and population.
     */
    query(params: AggregateQueryParams<TSchema>): Promise<any>;

    /**
     * Executes a standard `.find()` query with optional pagination and population.
     *
     * @param params - Query parameters including match filters, pagination, and populate flags.
     */
    find(params: AggregateQueryParams<TSchema>): Promise<any>;

    /**
     * Executes an aggregation pipeline query with support for filters, pagination, and population.
     *
     * @param params - Aggregation query parameters including match filters, population pipelines, and pagination.
     */
    aggregate(params: AggregateQueryParams<TSchema>): Promise<any>;
}