/**
 * @file MovieReview update input schema.
 * MovieReviewUpdateInputSchema.ts
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import {PositiveIntegerSchema} from "../../../shared/schema/numbers/PositiveIntegerSchema.js";
import {BooleanValueSchema} from "../../../shared/schema/booleans/BooleanValueSchema.js";

/**
 * Input schema for updating MovieReview records.
 */
export const MovieReviewUpdateInputSchema = z.object({
    displayName: NonEmptyStringSchema.max(100, {message: "Must be 100 characters or less."}),
    summary: NonEmptyStringSchema.max(500, {message: "Must be 500 characters or less."}),
    reviewText: NonEmptyStringSchema.max(2000, {message: "Must be 2000 characters or less."}).optional(),
    rating: PositiveIntegerSchema.refine((val) => val >= 0 && val <= 5, {message: "Must be 1 to 5."}),
    isRecommended: BooleanValueSchema.optional(),
});

/**
 * Inferred type for update input data.
 */
export type MovieReviewUpdateInputData = z.infer<typeof MovieReviewUpdateInputSchema>;