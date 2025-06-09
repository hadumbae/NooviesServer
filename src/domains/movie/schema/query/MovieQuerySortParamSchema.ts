import {z} from "zod";
import type {MovieQueryMatchParamSchema} from "./MovieQueryMatchParamSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Schema for sorting parameters in movie queries, parsed from URL query parameters.
 *
 * Supports sorting by release date and title, using Mongoose-compatible sort orders.
 *
 * @property sortByReleaseDate - Sort order for the release date field.
 * @property sortByTitle - Sort order for the title field.
 */
export const MovieQuerySortParamSchema = z.object({
    sortByReleaseDate: URLParamMongooseSortOrderSchema,
    sortByTitle: URLParamMongooseSortOrderSchema,
});

/**
 * Inferred TypeScript type for `MovieQuerySortParamSchema`.
 *
 * Represents the validated and parsed shape of the movie query sorting parameters.
 */
export type MovieQuerySortParams = z.infer<typeof MovieQueryMatchParamSchema>;