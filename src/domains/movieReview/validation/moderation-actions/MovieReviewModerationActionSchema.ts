/**
 * @file Zod validation schema for movie review moderation actions.
 * @filename MovieReviewModerationActionSchema.ts
 */

import {z} from "zod";
import {MovieReviewModerationActionConstant} from "@domains/movieReview/validation/moderation-actions/constant";

/**
 * Schema for validating administrative moderation commands.
 * ---
 */
export const MovieReviewModerationActionSchema = z.enum(
    MovieReviewModerationActionConstant,
    {
        /** Custom logic to translate Zod internal issues into readable administrative feedback. */
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) return {message: "Invalid Value."};
            if (issue.code === z.ZodIssueCode.invalid_type) return {message: "Must be a valid string."};
            return {message: ctx.defaultError};
        }
    }
);

/** * TypeScript type inferred from the {@link MovieReviewModerationActionSchema}. */
export type MovieReviewModerationAction = z.infer<typeof MovieReviewModerationActionSchema>;