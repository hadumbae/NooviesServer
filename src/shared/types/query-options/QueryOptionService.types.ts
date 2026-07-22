/**
 * @fileoverview Defines types for managing Mongoose query filters, sorting, and pipeline stages.
 */

import type { FilterQuery, SortOrder } from "mongoose";
import type {ReferenceFilterPipelineStages, ReferenceSortPipelineStages} from "@/shared/_types";

/** Represents sorting criteria for a schema. */
export type SortQuery<TSchema> =
    Partial<Record<keyof TSchema, SortOrder>> &
    Record<string, unknown>;

/** Options for matching documents based on filters and sorts. */
export type QueryMatchOptions<TSchema, TFilters> = {
    filters: FilterQuery<TFilters>;
    sorts: SortQuery<TSchema>;
}

/** Pipeline stages for filtering and sorting referenced documents. */
export type QueryReferenceOptions = {
    filters: ReferenceFilterPipelineStages;
    sorts: ReferenceSortPipelineStages;
}

/** Combined query options requiring either match or reference configurations. */
export type QueryOptionTypes<TSchema, TMatchFilters,> = {
    match: QueryMatchOptions<TSchema, TMatchFilters>;
    reference?: QueryReferenceOptions;
    options?: Record<string, unknown>;
} | {
    match?: QueryMatchOptions<TSchema, TMatchFilters>;
    reference: QueryReferenceOptions;
    options?: Record<string, unknown>;
};
