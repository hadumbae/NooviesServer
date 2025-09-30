import {z} from "zod";
import {
    MovieCreditQueryFiltersSchema,
    MovieCreditQueryMatchFiltersSchema,
    MovieCreditQueryOptionsSchema,
    MovieCreditQueryReferenceFiltersSchema,
    MovieCreditQueryMatchSortsSchema
} from "./MovieCreditQueryOption.schema.js";

/**
 * Type representing filters for matching MovieCredit documents.
 * Derived from `MovieCreditQueryMatchFiltersSchema`.
 */
export type MovieCreditQueryMatchFilters = z.infer<typeof MovieCreditQueryMatchFiltersSchema>;

/**
 * Type representing filters for populating related fields in MovieCredit queries.
 * Derived from `MovieCreditQueryPopulateFiltersSchema`.
 */
export type MovieCreditQueryReferenceFilters = z.infer<typeof MovieCreditQueryReferenceFiltersSchema>;

/**
 * Type representing all filters for `MovieCredit` queries.
 * Derived from `MovieCreditQueryFiltersSchema`.
 *
 * Combines both match filters and populate filters.
 *
 * @example
 * ```ts
 * const filters: MovieCreditQueryFilters = {
 *   match: { role: "supporting" },
 *   populate: { actor: true }
 * };
 * ```
 */
export type MovieCreditQueryFilters = z.infer<typeof MovieCreditQueryFiltersSchema>;

/**
 * Type representing sorting options for MovieCredit queries.
 * Derived from `MovieCreditQuerySortsSchema`.
 */
export type MovieCreditQueryMatchSorts = z.infer<typeof MovieCreditQueryMatchSortsSchema>;

/**
 * Type representing full query options for MovieCredit queries,
 * including both filters (match & populate) and sorting options.
 * Derived from `MovieCreditQueryOptionsSchema`.
 */
export type MovieCreditQueryOptions = z.infer<typeof MovieCreditQueryOptionsSchema>;