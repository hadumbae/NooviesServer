import type {FilterQuery} from "mongoose";
import type {PopulatePipelineStages} from "../../types/mongoose/PopulatePipelineStages.js";
import type {QueryOptionParams} from "../../schema/query/QueryOptionParamsSchema.js";

/**
 * The return type for aggregate queries—
 * either a flat array of results or a structured object containing
 * a total count and the result items.
 *
 * @typeParam TResult - The type of each item in the result.
 */
export type AggregateQueryResults<TResult = any> = TResult[] | { totalItems: number, items: TResult[] };

/**
 * Parameters for adding filters to aggregation stages.
 *
 * @typeParam TSchema - The document schema type being queried.
 *
 * @param matchFilters - Optional MongoDB filter for matching documents in the base collection.
 * @param populateFilters - Optional pipeline stages (e.g., `$lookup`, `$match`)
 *   used to filter or transform related documents before returning.
 */
export type AggregateCountParams<TSchema = Record<string, any>> = {
    matchFilters?: FilterQuery<TSchema>,
    populateFilters?: PopulatePipelineStages,
}

/**
 * Full parameters for aggregation queries including pagination and relational lookups.
 *
 * @typeParam TSchema - The document schema type being queried.
 *
 * @param matchFilters - Optional MongoDB filter for matching base documents.
 * @param populateFilters - Optional pipeline stages to filter or process related data.
 * @param populatePipelines - Optional pipeline stages for eager-loading relations (e.g., for `movie → credits` lookups).
 * @param paginated - When true, enables pagination fields (`page` and `perPage`).
 * @param page - Current page number (1-based). Must be provided if `paginated` is `true`.
 * @param perPage - Number of items per page. Must be provided if `paginated` is `true`.
 *   If `paginated` is false or omitted, `page` and `perPage` are not allowed.
 *
 * @remarks
 * Variant types ensure compile-time safety:
 * - With `paginated: true`, both `page` and `perPage` **must** be provided.
 * - With `paginated: false` or omitted, pagination fields are **forbidden**.
 */
export type AggregateQueryParams<TSchema = Record<string, any>> = QueryOptionParams & AggregateCountParams & {
    populatePipelines?: PopulatePipelineStages
} & (| {
    paginated: true,
    page: number,
    perPage: number,
} | {
    paginated?: false,
    page?: never,
    perPage?: never
});