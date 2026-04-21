import {
    MovieCreditQueryReferenceFiltersSchema
} from "@domains/movieCredit/_feat/validate-query/MovieCreditQueryReferenceFiltersSchema";
import {z} from "zod";

import {
    MovieCreditQueryMatchFiltersSchema
} from "@domains/movieCredit/_feat/validate-query/MovieCreditQueryMatchFiltersSchema";

/**
 * Combined filter schema for MovieCredit queries.
 *
 * @remarks
 * Merges match-level and reference-level filters into a single schema
 * for convenience when constructing aggregation pipelines.
 */
export const MovieCreditQueryFiltersSchema =
    MovieCreditQueryMatchFiltersSchema.merge(MovieCreditQueryReferenceFiltersSchema);
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