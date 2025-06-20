import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";

/**
 * Zod schema for validating route match parameters related to a screen query.
 *
 * This schema is typically used to validate dynamic route parameters from a URL (e.g. `/screens/:theatre`).
 * It ensures that the `theatre` parameter is a valid ObjectId string as expected by the backend.
 */
export const ScreenQueryMatchParamsSchema = z.object({
    theatre: URLParamObjectIDSchema,
});

/**
 * Inferred TypeScript type for `ScreenQueryMatchParamsSchema`.
 *
 * Represents the shape of validated route parameters for screen queries.
 */
export type ScreenQueryMatchParams = z.infer<typeof ScreenQueryMatchParamsSchema>;