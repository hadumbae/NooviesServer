/**
 * @fileoverview Validation schema and inferred types for Genre input.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";

/**
 * Validates Genre data for creation or updates.
 */
export const GenreInputSchema = z.object({
    /** 1-150 characters. */
    name: NonEmptyStringSchema.max(150, "Must be 150 characters or less."),

    /** Max 1000 characters. */
    description: NonEmptyStringSchema.max(1000, "Must be 1000 characters or less."),
});

/**
 * Type representing validated Genre input data.
 */
export type GenreInputData = z.infer<typeof GenreInputSchema>;