/**
 * @file Zod validation schema for administrative display name resets on movie reviews.
 * @filename ResetReviewDisplayNameInputSchema.ts
 */

import {AdminModerationMessageInputSchema} from "@shared/features/admin-users/schema";
import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/**
 * Validates the input required to reset a reviewer's display name.
 * ---
 */
export const ResetReviewDisplayNameInputSchema = AdminModerationMessageInputSchema.extend({
    /** The corrected or defaulted display name to be applied to the review. */
    displayName: NonEmptyStringSchema.max(100, "Must be 100 characters or less."),
});

/** * TypeScript type inferred from {@link ResetReviewDisplayNameInputSchema}.
 * Used for handling administrative display name correction requests.
 */
export type ResetReviewDisplayNameInputData = z.infer<typeof ResetReviewDisplayNameInputSchema>;