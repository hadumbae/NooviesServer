/**
 * @file Zod validation schema for administrative rating adjustments on movie reviews.
 * @filename SetReviewRatingInputSchema.ts
 */

import {AdminModerationMessageInputSchema} from "@shared/features/admin-users/schema";
import {z} from "zod";
import {NumberValueSchema} from "@shared/schema/numbers/NumberValueSchema";

/**
 * Validates the input required to manually adjust a review's star rating.
 * ---
 */
export const SetReviewRatingInputSchema = AdminModerationMessageInputSchema.extend({
    /** The new numeric rating score assigned by the administrator. */
    rating: NumberValueSchema
        .gte(0, "Must be 0 or more.")
        .lte(5, "Must be 5 or less."),
});

/**
 * TypeScript type inferred from {@link SetReviewRatingInputSchema}.
 * Used by moderation controllers to handle manual rating overrides.
 */
export type SetReviewRatingInputData = z.infer<typeof SetReviewRatingInputSchema>;