/**
 * @file TypeScript interface for Movie Review moderation audit logs.
 * @filename MovieReviewModerationLog.types.ts
 */

import type {
    MovieReviewModerationAction
} from "@domains/movieReview/validation/moderation-actions/MovieReviewModerationActionSchema";
import {Types} from "mongoose";

/**
 * Fields for a single moderation log entry within a review document.
 * ---
 */
export type MovieReviewModerationLogSchemaFields = {
    /** The specific moderation command executed. */
    action: MovieReviewModerationAction;

    /** Reference to the Administrator who performed the action. */
    admin: Types.ObjectId;

    /** Contextual note or reasoning for the moderation (e.g., "Violation of TOS"). */
    message: string;

    /** The date and time when this specific moderation event occurred. */
    modDate: Date;
};