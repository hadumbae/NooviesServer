/**
 * @file Administrative services for moderating movie reviews and managing audit logs.
 * @filename service.ts
 */

import type {
    ResetDisplayNameConfig,
    ResetLikesConfig,
    SetRatingsConfig,
    ToggleReviewPublicityConfig,
    WriteMovieReviewModLogConfig,
} from "@domains/movieReview/features/customer-review-actions/services/service.types";
import {MovieReview} from "@domains/movieReview/model/MovieReview.model";
import createHttpError from "http-errors";
import {MovieReviewModerationLog} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.model";
import type {MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types";
import type {
    MovieReviewModerationLogSchemaFields
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.types";

/**
 * Internal helper to generate and validate a moderation audit log entry.
 * ---
 */
export const writeMovieReviewModLog = async (
    {admin, action, message}: WriteMovieReviewModLogConfig
): Promise<MovieReviewModerationLogSchemaFields> => {
    const log = new MovieReviewModerationLog({
        action,
        admin,
        message,
        modDate: new Date()
    });

    try {
        await log.validate();
        return log;
    } catch (error: unknown) {
        console.error("Critical: Failed to validate moderation log entry.", error);
        throw createHttpError(500, "Action aborted: Internal logging failure.");
    }
}

/**
 * Flips the visibility of a review (Public <-> Private) and logs the intervention.
 */
export const toggleReviewPublicity = async (
    {adminID, reviewID, message}: ToggleReviewPublicityConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findById(reviewID).orFail();
    const log = await writeMovieReviewModLog({action: "MOD_TOGGLE_PUBLICITY", admin: adminID, message});

    review.isPublic = !review.isPublic;
    review.moderationLogs.push(log);

    return await review.save();
}

/**
 * Overwrites a reviewer's display name, typically used for PII removal or moderation.
 */
export const resetDisplayName = async (
    {adminID, reviewID, message, displayName}: ResetDisplayNameConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findById(reviewID).orFail();
    const log = await writeMovieReviewModLog({action: "MOD_RESET_DISPLAY_NAME", admin: adminID, message});

    review.displayName = displayName;
    review.moderationLogs.push(log);

    return await review.save();
}

/**
 * Strips all "helpful" votes from a review to address engagement manipulation.
 */
export const resetLikes = async (
    {adminID, reviewID, message}: ResetLikesConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findById(reviewID).orFail();
    const log = await writeMovieReviewModLog({action: "MOD_RESET_LIKES", admin: adminID, message});

    review.helpfulLikes = [];
    review.moderationLogs.push(log);

    return await review.save();
}

/**
 * Manually adjusts the star rating of a review.
 */
export const setRatings = async (
    {adminID, reviewID, message, rating}: SetRatingsConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findById(reviewID).orFail();
    const log = await writeMovieReviewModLog({action: "MOD_SET_RATING", admin: adminID, message});

    review.rating = rating;
    review.moderationLogs.push(log);

    return await review.save();
}