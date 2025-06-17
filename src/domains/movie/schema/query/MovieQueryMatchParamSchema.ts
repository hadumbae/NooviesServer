import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamDateStringSchema} from "../../../../shared/schema/url/URLParamDateStringSchema.js";
import generateURLParamArraySchema from "../../../../shared/utility/zod/generateURLParamArraySchema.js";
import {ParsedObjectIdStringSchema} from "../../../../shared/schema/strings/ParsedObjectIdStringSchema.js";

/**
 * Schema for matching query parameters used to filter movies in a URL-based query.
 *
 * Accepts optional values from the URL and performs validation and transformation
 * suitable for parsing into a MongoDB query.
 *
 * @property _id - An optional ObjectId string representing the movie ID.
 * @property title - An optional string representing the movie title (used for regex matching).
 * @property releaseDate - An optional ISO 8601 date string.
 * @property genres - An optional array of ObjectId strings representing genre IDs.
 */
export const MovieQueryMatchParamSchema = z.object({
    _id: URLParamObjectIDSchema,
    title: URLParamStringSchema,
    releaseDate: URLParamDateStringSchema,
    genres: generateURLParamArraySchema(ParsedObjectIdStringSchema),
});

/**
 * Inferred TypeScript type for `MovieQueryMatchParamSchema`.
 *
 * Represents the validated and parsed shape of the movie query match parameters.
 */
export type MovieQueryMatchParams = z.infer<typeof MovieQueryMatchParamSchema>;