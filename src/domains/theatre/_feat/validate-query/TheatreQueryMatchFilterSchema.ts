/**
 * @fileoverview Validation schema for filtering Theatre entities in database queries.
 * Integrates fuzzy regex matching and standardized location schemas.
 */

import {z} from "zod";
import {URLParamStringSchema} from "@shared/schema/url/URLParamStringSchema";
import {URLParamNonNegativeNumberSchema} from "@shared/schema/url/URLParamNonNegativeNumberSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import {IANATimezoneSchema} from "@shared/schema/date-time/IANATimezoneSchema";
import {URLParamRegexPatternSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining the available match filters for Theatre queries.
 */
export const TheatreQueryMatchFilterSchema = z.object({
    name: URLParamRegexPatternSchema,
    seatCapacity: URLParamNonNegativeNumberSchema,
    street: URLParamRegexPatternSchema,
    city: URLParamRegexPatternSchema,
    state: URLParamRegexPatternSchema,
    country: ISO3166Alpha2CountryCodeSchema.optional(),
    postalCode: URLParamStringSchema,
    timezone: IANATimezoneSchema.optional(),
});

/**
 * TypeScript type inferred from TheatreQueryMatchFilterSchema.
 */
export type TheatreQueryMatchFilters = z.infer<typeof TheatreQueryMatchFilterSchema>;