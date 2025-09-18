import type {FilterQuery, SortOrder} from "mongoose";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages
} from "../../types/mongoose/AggregatePipelineStages.js";
import type {QueryOptionParams} from "../../schema/query/QueryOptionParamsSchema.js";

/**
 * Represents the result of an aggregation query.
 *
 * Depending on the query mode, the result can either be:
 * - **Non-paginated:** an array of documents (`TResult[]`).
 * - **Paginated:** an object containing `totalItems` and `items`.
 *
 * @template TResult - The type of each document in the result.
 *
 * @example
 * ```ts
 * // Non-paginated results
 * const users: AggregateQueryResults<User> = [
 *   { name: "Alice" },
 *   { name: "Bob" }
 * ];
 *
 * // Paginated results
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
 * Can be used in two modes:
 * - **Paginated:** requires `paginated: true` and pagination details (`page`, `perPage`).
 * - **Non-paginated:** `paginated` is `false` or omitted, and no pagination fields are allowed.
 *
 * @example
 * ```ts
 * // Paginated mode
 * const params: AggregatePaginationParams = {
 *   paginated: true,
 *   page: 2,
 *   perPage: 20
 * };
 *
 * // Non-paginated mode
 * const params: AggregatePaginationParams = {
 *   paginated: false
 * };
 * ```
 */
export type AggregatePaginationParams =
    | { paginated: true; page: number; perPage: number }
    | { paginated?: false; page?: never; perPage?: never };

/**
 * Parameters for filtering and counting documents in an aggregation query.
 *
 * @template TSchema - The schema type of documents in the collection.
 */
export type AggregateCountParams<TSchema = Record<string, any>> = {
    /**
     * Standard Mongoose filter query applied directly to the base collection.
     *
     * @example
     * ```ts
     * { isActive: true, age: { $gte: 18 } }
     * ```
     */
    matchFilters?: FilterQuery<TSchema>;

    /**
     * Reference filters applied via aggregation stages,
     * such as `$lookup` and `$unwind`, to filter related documents.
     *
     * @example
     * ```ts
     * [
     *   { $lookup: { from: "roles", localField: "roleId", foreignField: "_id", as: "role" } },
     *   { $match: { "role.name": "admin" } }
     * ]
     * ```
     */
    referenceFilters?: ReferenceFilterPipelineStages;
};

/**
 * Full parameter set for an aggregation query.
 *
 * Combines:
 * - **Query options:** {@link QueryOptionParams}
 * - **Filtering and count options:** {@link AggregateCountParams}
 * - **Pagination mode:** {@link AggregatePaginationParams}
 * - **Population pipelines:** optional {@link PopulationPipelineStages}
 *
 * @template TSchema - The schema type of documents in the collection.
 */
export type AggregateQueryParams<TSchema = Record<string, any>> =
    QueryOptionParams &
    AggregateCountParams<TSchema> &
    AggregatePaginationParams &
    {
        /**
         * Optional aggregation pipelines for populating referenced documents.
         *
         * Typically includes `$lookup` and `$unwind` stages.
         */
        populationPipelines?: PopulationPipelineStages;

        /**
         * Sort order for query results.
         *
         * Keys correspond to schema fields, and values indicate sort direction.
         * Accepts `1 | -1 | "asc" | "desc"`.
         *
         * @example
         * ```ts
         * { createdAt: -1, name: "asc" }
         * ```
         */
        querySorts?: Partial<Record<keyof TSchema, SortOrder>>;
    };
