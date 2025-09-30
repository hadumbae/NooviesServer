import type {
    PopulationPipelineStages, ReferenceFilterPipelineStages,
} from "../../types/mongoose/AggregatePipelineStages.js";
import type {QueryOptionParams} from "../../schema/query/QueryOptionParamsSchema.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {FilterQuery} from "mongoose";

/**
 * Represents the result shape of an aggregate query.
 *
 * @typeParam TResult - The document type returned by the aggregation.
 *
 * @remarks
 * - Can either be a raw array of results (`TResult[]`),
 *   or a paginated response object containing `totalItems` and `items`.
 */
export type AggregateQueryResults<TResult = any> =
    TResult[] | { totalItems: number; items: TResult[] };

/**
 * Parameters controlling pagination behavior for aggregate queries.
 *
 * @remarks
 * - When `paginated: true`, both `page` and `perPage` are required.
 * - When not paginated, these fields must be omitted.
 */
export type AggregatePaginationParams =
    | { paginated: true; page: number; perPage: number }
    | { paginated?: false; page?: never; perPage?: never };

/**
 * Input parameters for performing an aggregate query.
 *
 * @typeParam TSchema - The schema type for the main collection documents.
 * @typeParam TMatchFilters - The type representing filterable fields.
 *
 * @remarks
 * - Combines generic query options with optional pagination and population stages.
 * - `options` specifies match filters, sorts, and reference filters.
 * - `populationPipelines` allows enriching results with `$lookup` and `$unwind` stages.
 */
export type AggregateQueryParams<
    TSchema = Record<string, unknown>,
    TMatchFilters = any,
> =
    QueryOptionParams &
    AggregatePaginationParams &
    {
        /** Query and filter options (match filters, sorts, reference filters). */
        options: QueryOptionTypes<TSchema, TMatchFilters>;

        /** Optional pipeline stages for populating references (e.g., Person, Movie). */
        populationPipelines?: PopulationPipelineStages;
    };

/**
 * Parameters for counting documents in an aggregate query.
 *
 * @typeParam TMatchFilters - The type representing filterable fields.
 *
 * @remarks
 * - `matchFilters` apply standard query filters.
 * - `referenceFilters` allow filtering on joined reference documents.
 */
export type AggregateCountParams<TMatchFilters> = {
    /** Match filters applied directly to the main collection. */
    matchFilters?: FilterQuery<TMatchFilters>;

    /** Reference filters applied through `$lookup` stages. */
    referenceFilters?: ReferenceFilterPipelineStages;
};
