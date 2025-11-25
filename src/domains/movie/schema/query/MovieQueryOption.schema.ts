import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamDateOnlySchema} from "../../../../shared/schema/url/URLParamDateOnlySchema.js";
import generateURLParamArraySchema from "../../../../shared/utility/schema/url-params/generateURLParamArraySchema.js";
import {ObjectIdSchema} from "../../../../shared/schema/mongoose/ObjectIdSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {ISO3166Alpha2CountryCodeSchema} from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";

/**
 * Schema for filtering movies in query parameters.
 *
 * Supports filtering by:
 * - `_id`: The movie's ObjectId
 * - `title`: Movie title string
 * - `releaseDate`: Movie release date string
 * - `genres`: Array of genre ObjectIds
 */
export const MovieQueryMatchFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    title: URLParamStringSchema,
    releaseDate: URLParamDateOnlySchema,
    genres: generateURLParamArraySchema(ObjectIdSchema),
    originalTitle: URLParamStringSchema,
    isReleased: URLParamBooleanSchema,
    country: ISO3166Alpha2CountryCodeSchema.optional(),
    isAvailable: URLParamBooleanSchema,
});

/**
 * Schema for sorting movies in query parameters.
 *
 * Supports sorting by:
 * - `sortByReleaseDate`: Sort order for release date (asc/desc)
 * - `sortByTitle`: Sort order for title (asc/desc)
 */
export const MovieQueryMatchSortsSchema = z.object({
    sortByReleaseDate: URLParamMongooseSortOrderSchema,
    sortByTitle: URLParamMongooseSortOrderSchema,
    sortByOriginalTitle: URLParamMongooseSortOrderSchema,
    sortByIsReleased: URLParamMongooseSortOrderSchema,
    sortByIsAvailable: URLParamMongooseSortOrderSchema,
    sortByCountry: URLParamMongooseSortOrderSchema,
});

/**
 * Combined schema for movie query options including both
 * filters and sorting.
 */
export const MovieQueryOptionsSchema = MovieQueryMatchSortsSchema.merge(MovieQueryMatchFiltersSchema);