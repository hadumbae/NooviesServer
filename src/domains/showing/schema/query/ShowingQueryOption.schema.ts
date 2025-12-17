import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {ISO6391LanguageCodeSchema} from "../../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import generateURLParamArraySchema from "../../../../shared/utility/schema/url-params/generateURLParamArraySchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {ShowingStatusEnumSchema} from "../ShowingStatusEnumSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {ISO3166Alpha2CountryCodeSchema} from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";

/**
 * @file ShowingQuerySchemas.ts
 *
 * Zod schemas for validating and normalizing URL query parameters
 * used when querying Showings.
 *
 * Schemas are split by responsibility:
 * - Match filters (field-level constraints)
 * - Sort options
 * - Reference-based text filters
 */

// --- Match Filters ---

/**
 * Match-level filters applied directly to Showing fields.
 */
export const ShowingQueryMatchFilterSchema = z.object({
    movie: URLParamObjectIDSchema,
    theatre: URLParamObjectIDSchema,
    screen: URLParamObjectIDSchema,
    language: ISO6391LanguageCodeSchema,
    subtitleLanguages: generateURLParamArraySchema(ISO6391LanguageCodeSchema),
    isSpecialEvent: URLParamBooleanSchema,
    isActive: URLParamBooleanSchema,
    status: ShowingStatusEnumSchema,
});

// --- Sort Options ---

/**
 * Sort options for Showing queries.
 *
 * Values map directly to Mongoose sort order semantics.
 */
export const ShowingQueryMatchSortSchema = z.object({
    sortByStartTime: URLParamMongooseSortOrderSchema,
    sortByEndTime: URLParamMongooseSortOrderSchema,
    sortByTicketPrice: URLParamMongooseSortOrderSchema,
    sortByIsSpecialEvent: URLParamMongooseSortOrderSchema,
    sortByIsActive: URLParamMongooseSortOrderSchema,
    sortByStatus: URLParamMongooseSortOrderSchema,
});

// --- Reference Filters ---

/**
 * Text-based filters applied to referenced documents.
 *
 * These filters typically require lookup or population stages.
 */
export const ShowingQueryReferenceFilterSchema = z.object({
    movieTitle: URLParamStringSchema,
    screenName: URLParamStringSchema,
    theatreName: URLParamStringSchema,
    theatreState: URLParamStringSchema,
    theatreCity: URLParamStringSchema,
    theatreCountry: ISO3166Alpha2CountryCodeSchema.optional(),
});

// --- Combined Schema ---

/**
 * Complete query option schema for Showing endpoints.
 *
 * Combines match filters, sort options, and reference filters
 * into a single validation schema.
 */
export const ShowingQueryOptionSchema = ShowingQueryMatchFilterSchema
    .merge(ShowingQueryMatchSortSchema)
    .merge(ShowingQueryReferenceFilterSchema);
