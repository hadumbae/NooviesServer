/**
 * @fileoverview Validation schema and types for Person query filtering.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@/shared/schema/url/URLParamObjectIDSchema";
import {URLParamDateOnlySchema} from "@/shared/schema/url/URLParamDateOnlySchema";
import {ISO3166Alpha2CountryCodeSchema} from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import {URLParamRegexPatternSchema} from "@/shared/_feat/parse-query-string";

/**
 * Validates filtering criteria for Person queries.
 */
export const PersonQueryMatchFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    name: URLParamRegexPatternSchema,
    dob: URLParamDateOnlySchema,
    nationality: ISO3166Alpha2CountryCodeSchema.optional(),
});

/**
 * Type representing validated filters for Person document queries.
 */
export type PersonQueryMatchFilters = z.infer<typeof PersonQueryMatchFiltersSchema>;