/**
 * @fileoverview Validation schema and inferred types for Genre input.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {BooleanValueSchema} from "@/shared/_schema/booleans/BooleanValueSchema";

/** Validates Genre data for creation or updates. */
export const GenreInputSchema = z.object({
    name: NonEmptyStringSchema.max(150, "Must be 150 characters or less."),
    description: NonEmptyStringSchema.max(1000, "Must be 1000 characters or less."),
    isFeatured: BooleanValueSchema.optional().default(false),
});

/** Type representing validated Genre input data. */
export type GenreInputData = z.infer<typeof GenreInputSchema>;