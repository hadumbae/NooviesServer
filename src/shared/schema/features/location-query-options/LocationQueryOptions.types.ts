/**
 * @file LocationQueryOptions.types.ts
 *
 * Inferred TypeScript types for location query option schemas.
 */

import {z} from "zod";
import {
    LocationQueryOptionsSchema,
    LocationTargetObjectSchema,
    LocationTargetSchema,
} from "./LocationQueryOptions.schema.js";

/**
 * Free-form or standardized location target value.
 */
export type LocationTarget = z.infer<
    typeof LocationTargetSchema
>;

/**
 * Object wrapper for an optional location target.
 */
export type LocationTargetObject = z.infer<
    typeof LocationTargetObjectSchema
>;

/**
 * Normalized location query options.
 */
export type LocationQueryOptions = z.infer<
    typeof LocationQueryOptionsSchema
>;
