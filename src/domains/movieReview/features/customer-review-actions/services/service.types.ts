/**
 * @fileoverview Defines the type configurations and response structures for
 * administrative movie review moderation services and audit logging.
 */

import {Types} from "mongoose";
import type {AdminModerationMessage} from "@shared/_feat/admin-users/schema";
import type {
    MovieReviewModerationAction
} from "@domains/movieReview/validation/moderation-actions/MovieReviewModerationActionSchema";

/**
 * Configuration for toggling a review's visibility status (Public/Private).
 */
export type ToggleReviewPublicityConfig = {
    adminID: Types.ObjectId;
    reviewID: Types.ObjectId;
    message: AdminModerationMessage;
};

/**
 * Configuration for resetting a reviewer's display name, typically used
 * for moderation or PII removal.
 */
export type ResetDisplayNameConfig = {
    displayName: string;
    adminID: Types.ObjectId;
    reviewID: Types.ObjectId;
    message: AdminModerationMessage;
};

/**
 * Configuration for clearing all "helpful" likes/votes from a specific review.
 */
export type ResetLikesConfig = {
    adminID: Types.ObjectId;
    reviewID: Types.ObjectId;
    message: AdminModerationMessage;
};

/**
 * Configuration for manually adjusting the numeric rating of a review.
 */
export type SetRatingsConfig = {
    rating: number;
    adminID: Types.ObjectId;
    reviewID: Types.ObjectId;
    message: AdminModerationMessage;
};

/**
 * Payload structure for writing an entry into the Movie Review moderation log.
 */
export type WriteMovieReviewModLogConfig = {
    reviewID: Types.ObjectId;
    action: MovieReviewModerationAction;
    admin: Types.ObjectId;
    message: AdminModerationMessage;
};