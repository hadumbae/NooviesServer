/** @fileoverview Defines the combined validation schema and type for MovieCredit query filters. */

import {z} from "zod";
import {MovieCreditQueryReferenceFiltersSchema} from "./MovieCreditQueryReferenceFiltersSchema";
import {MovieCreditQueryMatchFiltersSchema} from "@/domains/movieCredit/_feat/validate-query";

/** Zod schema merging match-level and reference-level filters for MovieCredit queries. */
export const MovieCreditQueryFiltersSchema =
    MovieCreditQueryMatchFiltersSchema.merge(MovieCreditQueryReferenceFiltersSchema);

/** Type representing the combined match and reference filters for MovieCredit queries. */
export type MovieCreditQueryFilters = z.infer<typeof MovieCreditQueryFiltersSchema>;