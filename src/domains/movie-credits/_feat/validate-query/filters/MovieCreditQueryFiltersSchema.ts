/** @fileoverview Defines the combined validation schema and type for MovieCredit query filters. */

import {z} from "zod";
import {
    MovieCreditQueryReferenceFiltersSchema
} from "@/domains/movie-credits/_feat/validate-query/filters/MovieCreditQueryReferenceFiltersSchema";
import {
    MovieCreditQueryMatchFiltersSchema
} from "@/domains/movie-credits/_feat/validate-query/filters/MovieCreditQueryMatchFiltersSchema";

/** Zod schema merging match-level and reference-level filters for MovieCredit queries. */
export const MovieCreditQueryFiltersSchema =
    MovieCreditQueryMatchFiltersSchema.merge(MovieCreditQueryReferenceFiltersSchema);

/** Type representing the combined match and reference filters for MovieCredit queries. */
export type MovieCreditQueryFilters = z.infer<typeof MovieCreditQueryFiltersSchema>;