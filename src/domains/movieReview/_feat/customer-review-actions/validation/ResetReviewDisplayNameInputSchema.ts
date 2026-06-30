/**
 * @fileoverview Zod validation schema for administrative display name resets on movie reviews.
 */

import {AdminModerationMessageInputSchema} from "@/shared/_feat/admin-users/schema";
import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/** Validates the input required to reset a reviewer's display name. */
export const ResetReviewDisplayNameInputSchema = AdminModerationMessageInputSchema.extend({
    displayName: NonEmptyStringSchema.max(100, "Must be 100 characters or less."),
});

/** TypeScript type inferred from ResetReviewDisplayNameInputSchema. */
export type ResetReviewDisplayNameInputData = z.infer<typeof ResetReviewDisplayNameInputSchema>;