import {z} from "zod";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";

/**
 * Schema for validating URL query parameters used to populate related
 * data for movie credits (e.g., filtering by person or movie attributes).
 *
 * All parameters are optional trimmed strings. Empty or missing values
 * will be treated as `undefined`.
 *
 * ## Fields:
 * - `name`: Used to filter people by name (e.g., actor or crew member).
 * - `title`: Used to filter movies by title.
 */
export const MovieCreditPopulateQueryParamsSchema = z.object({
    /** Name of the person (e.g. actor, director) to filter by. */
    name: URLParamStringSchema,

    /** Title of the movie to filter by. */
    title: URLParamStringSchema,
});