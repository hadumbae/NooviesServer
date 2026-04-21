/**
 * @fileoverview Validation schema for reference-based filtering of Showing entities.
 * Resolves relationships through joined entities like Movie, Theatre, and Screen.
 */

import {z} from "zod";
import {URLParamStringSchema} from "@shared/schema/url/URLParamStringSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";

/**
 * Zod schema defining reference filters for Showing queries.
 */
export const ShowingQueryReferenceFilterSchema = z.object({
    movieSlug: URLParamStringSchema,
    theatreSlug: URLParamStringSchema,
    screenSlug: URLParamStringSchema,
    theatreState: URLParamStringSchema,
    theatreCity: URLParamStringSchema,
    theatreCountry: ISO3166Alpha2CountryCodeSchema.optional(),
});

/**
 * TypeScript type inferred from ShowingQueryReferenceFilterSchema.
 */
export type ShowingQueryReferenceFilters = z.infer<typeof ShowingQueryReferenceFilterSchema>;