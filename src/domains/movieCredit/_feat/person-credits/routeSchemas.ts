/**
 * @fileoverview Route validation schemas for person filmography retrieval.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import {CoercedNonNegativeNumberSchema} from "@shared/schema/numbers/coerced-number/CoercedNonNegativeNumberSchema";

/**
 * Validation schema for the fetchPersonFilmography route parameters and query strings.
 */
export const FetchPersonFilmographyRouteConfigSchema = z.object({
    personID: ObjectIdSchema,
    limit: CoercedNonNegativeNumberSchema.optional(),
});

/**
 * Inferred type for person filmography route configuration.
 */
export type FetchPersonFilmographyRouteConfig = z.infer<typeof FetchPersonFilmographyRouteConfigSchema>;