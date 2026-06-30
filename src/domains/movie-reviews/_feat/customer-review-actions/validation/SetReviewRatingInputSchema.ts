/**
 * @fileoverview Zod validation schema for administrative rating adjustments on movie reviews.
 */

import {AdminModerationMessageInputSchema} from "@/shared/_feat/admin-users/schema";
import {z} from "zod";
import {NumberValueSchema} from "@/shared/schema/numbers/NumberValueSchema";

/** Validates the input required to manually adjust a review's star rating. */
export const SetReviewRatingInputSchema = AdminModerationMessageInputSchema.extend({
    rating: NumberValueSchema
        .gte(0, "Must be 0 or more.")
        .lte(5, "Must be 5 or less."),
});

/** TypeScript type inferred from SetReviewRatingInputSchema. */
export type SetReviewRatingInputData = z.infer<typeof SetReviewRatingInputSchema>;