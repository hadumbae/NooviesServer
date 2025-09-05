import type {FilterQuery} from "mongoose";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages
} from "../../types/mongoose/AggregatePipelineStages.js";
import type {QueryOptionParams} from "../../schema/query/QueryOptionParamsSchema.js";

/**
 * Represents the result of an aggregation query.
 *
 * Depending on the query, the result can either be:
 * - An array of documents (`TResult[]`) for non-paginated queries.
 * - An object containing `totalItems` and `items` for paginated queries.
 *
 * @template TResult - The type of each document in the result.
 *
 * @example
 * ```ts
 * const users: AggregateQueryResults<User> = [
 *   { name: "Alice" },
 *   { name: "Bob" }
 * ];
 *
 * const paginatedUsers: AggregateQueryResults<User> = {
 *   totalItems: 100,
 *   items: [{ name: "Alice" }, { name: "Bob" }]
 * };
 * ```
 */
export type AggregateQueryResults<TResult = any> =
    TResult[] | { totalItems: number; items: TResult[] };

/**
 * Parameters for controlling pagination in an aggregation query.
 *
 * Can either be:
 * - Paginated mode (`paginated: true`) with `page` and `perPage`.
 * - Non-paginated mode (`paginated` false or omitted), in which `page` and `perPage` must not be provided.
 */
export type AggregatePaginationParams =
    | { paginated: true; page: number; perPage: number }
    | { paginated?: false; page?: never; perPage?: never };

/**
 * Parameters for filtering and counting documents in an aggregation query.
 *
 * @template TSchema - The type of documents in the collection.
 */
export type AggregateCountParams<TSchema = Record<string, any>> = {
    /** Standard Mongoose filter query applied to the main collection. */
    matchFilters?: FilterQuery<TSchema>;

    /** Reference filters applied through aggregation pipelines (e.g., $lookup and $unwind). */
    referenceFilters?: ReferenceFilterPipelineStages;
};

/**
 * Full parameter set for an aggregation query.
 *
 * Combines:
 * - Generic query options (`QueryOptionParams`)
 * - Count and filtering parameters (`AggregateCountParams`)
 * - Pagination parameters (`AggregatePaginationParams`)
 * - Optional population pipelines for references (`PopulationPipelineStages`)
 *
 * @template TSchema - The type of documents in the collection.
 */
export type AggregateQueryParams<TSchema = Record<string, any>> =
    QueryOptionParams &
    AggregateCountParams<TSchema> &
    AggregatePaginationParams & {
    /** Optional aggregation pipelines to populate referenced documents. */
    populationPipelines?: PopulationPipelineStages;
};