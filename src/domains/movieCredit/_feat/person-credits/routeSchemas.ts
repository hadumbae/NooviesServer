/**
 * @fileoverview Route validation schemas for person filmography and credit
 * statistics.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import {CoercedNonNegativeNumberSchema} from "@shared/schema/numbers/coerced-number/CoercedNonNegativeNumberSchema";

/**
 * Validation schema for the fetchPersonCreditStats route parameters.
 */
export const FetchPersonCreditStatsRouteConfigSchema = z.object({
    personID: ObjectIdSchema,
});

/**
 * Inferred type for person credit statistics route configuration.
 */
export type FetchPersonCreditStatsRouteConfig = z.infer<typeof FetchPersonCreditStatsRouteConfigSchema>;

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