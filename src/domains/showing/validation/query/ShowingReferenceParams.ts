/**
 * @file ShowingReferenceParams.ts
 *
 * Zod schema defining reference-based filters for showing queries.
 *
 * These filters are resolved via related documents
 * (movie, theatre, screen) and are not stored directly
 * on the Showing entity itself.
 */

import {z} from "zod";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {ISO3166Alpha2CountryCodeSchema}
    from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";

/**
 * Filters applied through referenced entities.
 */
export const ShowingQueryReferenceFilterSchema = z.object({
    /** Movie identifier (slug) */
    movieSlug: URLParamStringSchema,

    /** Theatre identifier (slug) */
    theatreSlug: URLParamStringSchema,

    /** Screen identifier (slug) */
    screenSlug: URLParamStringSchema,

    /** Theatre state or province */
    theatreState: URLParamStringSchema,

    /** Theatre city */
    theatreCity: URLParamStringSchema,

    /** Theatre country (ISO 3166-1 alpha-2) */
    theatreCountry: ISO3166Alpha2CountryCodeSchema.optional(),
});

/**
 * Inferred type for reference-based showing filters.
 */
export type ShowingQueryReferenceFilters =
    z.infer<typeof ShowingQueryReferenceFilterSchema>;
