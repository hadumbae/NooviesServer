/**
 * @file Type definitions for administrative movie review moderation services and logging.
 * @filename service.types.ts
 */

import {Types} from "mongoose";
import type {AdminModerationMessage} from "@shared/features/admin-users/schema";
import type {
    MovieReviewModerationAction
} from "@domains/movieReview/validation/moderation-actions/MovieReviewModerationActionSchema";

/**
 * Configuration for toggling a review's visibility status.
 */
export type ToggleReviewPublicityConfig = {
    /** The Object ID of the administrator performing the action. */
    adminID: Types.ObjectId;
    /** The target review's unique database identifier. */
    reviewID: Types.ObjectId;
    /** Administrative justification for the visibility change. */
    message: AdminModerationMessage;
}

/**
 * Configuration for resetting a reviewer's display name to a system default or specific value.
 */
export type ResetDisplayNameConfig = {
    /** The new display name string to be assigned to the review. */
    displayName: string;
    /** The Object ID of the administrator performing the action. */
    adminID: Types.ObjectId;
    /** The target review's unique database identifier. */
    reviewID: Types.ObjectId;
    /** Administrative justification for the reset. */
    message: AdminModerationMessage;
}

/**
 * Configuration for clearing all "helpful" likes/votes from a specific review.
 */
export type ResetLikesConfig = {
    /** The Object ID of the administrator performing the action. */
    adminID: Types.ObjectId;
    /** The target review's unique database identifier. */
    reviewID: Types.ObjectId;
    /** Administrative justification for clearing engagement metrics. */
    message: AdminModerationMessage;
}

/**
 * Configuration for manually adjusting the numeric rating of a review.
 */
export type SetRatingsConfig = {
    /** The new integer score (typically 1-5). */
    rating: number;
    /** The Object ID of the administrator performing the action. */
    adminID: Types.ObjectId;
    /** The target review's unique database identifier. */
    reviewID: Types.ObjectId;
    /** Administrative justification for the rating modification. */
    message: AdminModerationMessage;
}

/**
 * Payload structure for writing an entry into the Movie Review moderation log.
 * ---
 */
export type WriteMovieReviewModLogConfig = {
    /** The categorized moderation event (e.g., Visibility Toggle, Rating Adjustment). */
    action: MovieReviewModerationAction;
    /** The database ID of the performing administrator. */
    admin: Types.ObjectId;
    /** The rationale behind the moderation decision. */
    message: AdminModerationMessage;
}