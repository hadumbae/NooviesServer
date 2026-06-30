/**
 * @fileoverview Zod validation schema for movie review moderation actions.
 */

import {z} from "zod";
import {MovieReviewModerationActionConstant} from "@/domains/movie-reviews/_validation/moderation-actions/constant";

/** Schema for validating administrative moderation commands. */
export const MovieReviewModerationActionSchema = z.enum(MovieReviewModerationActionConstant, {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return {message: "Invalid Value."};
        if (issue.code === z.ZodIssueCode.invalid_type) return {message: "Must be a valid string."};
        return {message: ctx.defaultError};
    }
});

/** TypeScript type inferred from the MovieReviewModerationActionSchema. */
export type MovieReviewModerationAction = z.infer<typeof MovieReviewModerationActionSchema>;