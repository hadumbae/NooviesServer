/**
 * @file Type definitions for administrative movie review moderation services.
 * @filename service.types.ts
 */

import {Types} from "mongoose";
import type {AdminModerationMessage} from "@shared/features/admin-users/schema";

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
    adminID: Types.ObjectId;
    reviewID: Types.ObjectId;
    /** The target display name string (Note: User input used Types.ObjectId, likely needs correction to string). */
    displayName: string;
    message: AdminModerationMessage;
}

/**
 * Configuration for clearing all "helpful" likes from a specific review.
 */
export type ResetLikesConfig = {
    adminID: Types.ObjectId;
    reviewID: Types.ObjectId;
    message: AdminModerationMessage;
}

/**
 * Configuration for manually adjusting the numeric rating of a review.
 */
export type SetRatingsConfig = {
    adminID: Types.ObjectId;
    reviewID: Types.ObjectId;
    /** The new integer score (typically 1-5). */
    rating: number;
    message: AdminModerationMessage;
}