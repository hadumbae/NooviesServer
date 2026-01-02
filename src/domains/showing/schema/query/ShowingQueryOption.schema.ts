/**
 * @file ShowingQueryOption.schema.ts
 *
 * URL query parameter schemas for fetching Showings.
 *
 * Defines Zod schemas used to validate and coerce URL query
 * parameters for Showings endpoints.
 *
 * Schema groups:
 * - Match filters (direct Showing fields)
 * - Sort options (MongoDB ordering)
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
 * Match filters applied directly to Showing document fields.
 */
export const ShowingQueryMatchFilterSchema = z.object({
    /** Movie ObjectId */
    movie: URLParamObjectIDSchema,

    /** Theatre ObjectId */
    theatre: URLParamObjectIDSchema,

    /** Screen ObjectId */
    screen: URLParamObjectIDSchema,

    /** Minimum ticket price */
    ticketPrice: URLParamPositiveNumberSchema,

    /** Special event flag */
    isSpecialEvent: URLParamBooleanSchema,

    /** Active status flag */
    isActive: URLParamBooleanSchema,

    /** Showing lifecycle status */
    status: ShowingStatusEnumSchema.optional(),
});

/**
 * Sort options for Showing queries.
 *
 * MongoDB semantics:
 * - `1` ascending
 * - `-1` descending
 */
export const ShowingQueryMatchSortSchema = z.object({
    /** Sort by start time */
    sortByStartTime: URLParamMongooseSortOrderSchema,

    /** Sort by end time */
    sortByEndTime: URLParamMongooseSortOrderSchema,
});

// --- REFERENCE SCHEMAS ---

/**
 * Filters resolved via referenced documents.
 *
 * These fields are not stored directly on the Showing document.
 */
export const ShowingQueryReferenceFilterSchema = z.object({
    /** Movie slug */
    movieSlug: URLParamStringSchema,

    /** Theatre slug */
    theatreSlug: URLParamStringSchema,

    /** Screen slug */
    screenSlug: URLParamStringSchema,

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
 */
export const ShowingQueryOptionSchema =
    ShowingQueryMatchFilterSchema
        .merge(ShowingQueryMatchSortSchema)
        .merge(ShowingQueryReferenceFilterSchema);
