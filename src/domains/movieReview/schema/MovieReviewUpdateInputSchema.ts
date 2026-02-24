/**
 * @file MovieReview update input schema.
 * MovieReviewUpdateInputSchema.ts
 */

import { z } from "zod";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { PositiveIntegerSchema } from "../../../shared/schema/numbers/PositiveIntegerSchema.js";
import { BooleanValueSchema } from "../../../shared/schema/booleans/BooleanValueSchema.js";

/**
 * Input schema for updating MovieReview records.
 */
export const MovieReviewUpdateInputSchema = z.object({
    movie: ObjectIdSchema,
    reviewText: NonEmptyStringSchema
        .max(2000, { message: "Must be 2000 characters or less." }),
    rating: PositiveIntegerSchema
        .refine((val) => val >= 0 && val <= 5, { message: "Must be 1 to 5." })
        .optional(),
    isRecommended: BooleanValueSchema
        .optional(),
});

/**
 * Inferred type for update input data.
 */
export type MovieReviewUpdateInputData = z.infer<typeof MovieReviewUpdateInputSchema>;