/**
 * @fileoverview Defines the validation schema and type for movie taglines.
 */

import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/** Zod schema for validating an optional movie tagline string. */
export const MovieTaglineSchema = NonEmptyStringSchema
    .max(100, "Must be 100 characters or less.")
    .optional()
    .nullable();

/** Type definition for a movie tagline. */
export type MovieTagline = z.infer<typeof MovieTaglineSchema>;