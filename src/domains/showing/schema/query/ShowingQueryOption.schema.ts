/**
 * @file ShowingQuerySchemas.ts
 *
 * @summary
 * URL query parameter schemas for fetching Showings.
 *
 * @description
 * Zod schemas used to validate, coerce, and normalize URL query
 * parameters when querying Showings endpoints.
 *
 * Schemas are grouped by responsibility:
 * - Match filters (direct Showing fields)
 * - Sort options (Mongo-style ordering)
 * - Reference-based filters (populated relations)
 */

import { z } from "zod";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamBooleanSchema } from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import { ShowingStatusEnumSchema } from "../ShowingStatusEnumSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { ISO3166Alpha2CountryCodeSchema } from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import { URLParamPositiveNumberSchema } from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";

// --- MATCH SCHEMAS ---

/**
 * Match-level filters applied directly to Showing fields.
 *
 * Values are coerced from URL parameters into strongly typed
 * query constraints.
 */
export const ShowingQueryMatchFilterSchema = z.object({
    /** Movie identifier */
    movie: URLParamObjectIDSchema,

    /** Theatre identifier */
    theatre: URLParamObjectIDSchema,

    /** Screen identifier */
    screen: URLParamObjectIDSchema,

    /** Special event flag */
    isSpecialEvent: URLParamBooleanSchema,

    /** Minimum ticket price */
    ticketPrice: URLParamPositiveNumberSchema,

    /** Active / inactive flag */
    isActive: URLParamBooleanSchema,

    /** Showing lifecycle status */
    status: ShowingStatusEnumSchema.optional(),
});

/**
 * Sort options for Showing queries.
 *
 * Uses MongoDB sort semantics:
 * - `1` ascending
 * - `-1` descending
 */
export const ShowingQueryMatchSortSchema = z.object({
    sortByStartTime: URLParamMongooseSortOrderSchema,
    sortByEndTime: URLParamMongooseSortOrderSchema,
});

// --- REFERENCE SCHEMAS ---

/**
 * Filters applied to referenced documents.
 *
 * These fields are resolved via lookups or populated relations
 * rather than direct Showing fields.
 */
export const ShowingQueryReferenceFilterSchema = z.object({
    /** Movie title (partial or full match) */
    movieTitle: URLParamStringSchema,

    /** Movie slug */
    movieSlug: URLParamStringSchema,

    /** Theatre name */
    theatreName: URLParamStringSchema,

    /** Theatre state / province */
    theatreState: URLParamStringSchema,

    /** Theatre city */
    theatreCity: URLParamStringSchema,

    /** Theatre country (ISO 3166-1 alpha-2) */
    theatreCountry: ISO3166Alpha2CountryCodeSchema.optional(),
});

// --- COMBINED SCHEMA ---

/**
 * Unified query schema for Showing endpoints.
 *
 * Combines:
 * - Direct match filters
 * - Reference-based filters
 * - Sort options
 */
export const ShowingQueryOptionSchema =
    ShowingQueryMatchFilterSchema
        .merge(ShowingQueryMatchSortSchema)
        .merge(ShowingQueryReferenceFilterSchema);
