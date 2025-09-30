import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamDateStringSchema} from "../../../../shared/schema/url/URLParamDateStringSchema.js";
import generateURLParamArraySchema from "../../../../shared/utility/zod/generateURLParamArraySchema.js";
import {ParsedObjectIdStringSchema} from "../../../../shared/schema/strings/ParsedObjectIdStringSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

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
    releaseDate: URLParamDateStringSchema,
    genres: generateURLParamArraySchema(ParsedObjectIdStringSchema),
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
});

/**
 * Combined schema for movie query options including both
 * filters and sorting.
 */
export const MovieQueryOptionsSchema = MovieQueryMatchSortsSchema.merge(MovieQueryMatchFiltersSchema);