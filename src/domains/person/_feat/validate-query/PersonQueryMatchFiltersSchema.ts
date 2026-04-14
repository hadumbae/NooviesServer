/**
 * @fileoverview Validation schema and types for Person query filtering.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamRegexStringSchema} from "@shared/schema/url/URLParamRegexStringSchema";
import {URLParamDateOnlySchema} from "@shared/schema/url/URLParamDateOnlySchema";
import {ISO3166Alpha2CountryCodeSchema} from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";

/**
 * Validates filtering criteria for Person queries.
 */
export const PersonQueryMatchFiltersSchema = z.object({
    /** Filter by unique MongoDB identifier. */
    _id: URLParamObjectIDSchema,

    /** Filter by name using case-insensitive regex. */
    name: URLParamRegexStringSchema,

    /** Filter by exact date of birth (YYYY-MM-DD). */
    dob: URLParamDateOnlySchema,

    /** Filter by ISO 3166-1 alpha-2 country code. */
    nationality: ISO3166Alpha2CountryCodeSchema.optional(),
});

/**
 * Type representing validated filters for Person document queries.
 */
export type PersonQueryMatchFilters = z.infer<typeof PersonQueryMatchFiltersSchema>;