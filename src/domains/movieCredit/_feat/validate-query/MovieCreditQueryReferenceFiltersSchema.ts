/**
 * @fileoverview Validation schema for reference-based filtering of MovieCredit entities.
 * These filters resolve relationships through joined entities such as Movie or RoleType.
 */

import {z} from "zod";
import {URLParamStringSchema} from "@shared/schema/url/URLParamStringSchema";
import {URLParamRegexPatternSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining reference filters for MovieCredit queries.
 */
export const MovieCreditQueryReferenceFiltersSchema = z.object({
    movieSlug: URLParamStringSchema,
    roleName: URLParamRegexPatternSchema,
});

/**
 * TypeScript type inferred from MovieCreditQueryReferenceFiltersSchema.
 */
export type MovieCreditQueryReferenceFilters = z.infer<typeof MovieCreditQueryReferenceFiltersSchema>;