/**
 * @fileoverview Provides administrative services for moderating movie reviews.
 * Includes functionality for toggling visibility, resetting engagement metrics,
 * and auditing all changes via moderation logs.
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
 * Creates and persists a moderation audit log entry in the database.
 * @throws {HttpError} If the log entry fails to persist.
 */
export const writeMovieReviewModLog = async (
    {reviewID, admin, action, message}: WriteMovieReviewModLogConfig
): Promise<MovieReviewModerationLogSchemaFields> => {
    try {
        return await MovieReviewModerationLog.create({
            action,
            admin,
            message,
            review: reviewID,
            modDate: new Date(),
        });
    } catch (error: unknown) {
        console.error("Critical: Failed to write moderation log.", error);
        throw createHttpError(500, "Action aborted: Internal logging failure.");
    }
};

/**
 * Toggles the visibility of a review between public and private states.
 * @throws {HttpError} If the reviewID does not exist.
 */
export const toggleReviewPublicity = async (
    {adminID, reviewID, message}: ToggleReviewPublicityConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findByIdAndUpdate(
        reviewID,
        [{$set: {isPublic: {$not: "$isPublic"}}}],
        {new: true}
    ).orFail();

    await writeMovieReviewModLog({
        reviewID,
        action: "MOD_TOGGLE_PUBLICITY",
        admin: adminID,
        message,
    });

    return review;
};

/**
 * Updates a reviewer's display name, used for moderation or PII removal.
 * @throws {HttpError} If the reviewID does not exist.
 */
export const resetDisplayName = async (
    {adminID, reviewID, message, displayName}: ResetDisplayNameConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findByIdAndUpdate(reviewID, {displayName}, {new: true}).orFail();
    await writeMovieReviewModLog({reviewID, action: "MOD_RESET_DISPLAY_NAME", admin: adminID, message});
    return review;
};

/**
 * Removes all "helpful" likes from a review to correct engagement manipulation.
 * @throws {HttpError} If the reviewID does not exist.
 */
export const resetLikes = async (
    {adminID, reviewID, message}: ResetLikesConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findByIdAndUpdate(reviewID, {helpfulLikes: []}, {new: true}).orFail();
    await writeMovieReviewModLog({reviewID, action: "MOD_RESET_LIKES", admin: adminID, message});
    return review;
};

/**
 * Updates the numerical star rating assigned to a specific movie review.
 * @throws {HttpError} If the reviewID does not exist.
 */
export const setRatings = async (
    {adminID, reviewID, message, rating}: SetRatingsConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findByIdAndUpdate(reviewID, {rating}, {new: true}).orFail();
    await writeMovieReviewModLog({reviewID, action: "MOD_SET_RATING", admin: adminID, message});
    return review;
};