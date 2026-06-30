/**
 * @fileoverview Administrative services for moderating movie reviews and auditing changes.
 */

import createHttpError from "http-errors";
import type {
    ResetDisplayNameConfig,
    ResetLikesConfig,
    SetRatingsConfig,
    ToggleReviewPublicityConfig,
    WriteMovieReviewModLogConfig,
} from "@/domains/movieReview/_feat/customer-review-actions/services/service.types";
import {
    MovieReview,
    MovieReviewModerationLog,
    type MovieReviewModerationLogSchemaFields,
    type MovieReviewSchemaFields
} from "@/domains/movieReview/model";

/** Creates and persists a moderation audit log entry in the database. */
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

/** Toggles the visibility of a review between public and private states. */
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

/** Updates a reviewer's display name for moderation or PII removal. */
export const resetDisplayName = async (
    {adminID, reviewID, message, displayName}: ResetDisplayNameConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findByIdAndUpdate(reviewID, {displayName}, {new: true}).orFail();
    await writeMovieReviewModLog({reviewID, action: "MOD_RESET_DISPLAY_NAME", admin: adminID, message});
    return review;
};

/** Removes all helpful likes from a review to correct engagement manipulation. */
export const resetLikes = async (
    {adminID, reviewID, message}: ResetLikesConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findByIdAndUpdate(reviewID, {helpfulLikes: []}, {new: true}).orFail();
    await writeMovieReviewModLog({reviewID, action: "MOD_RESET_LIKES", admin: adminID, message});
    return review;
};

/** Updates the numerical star rating assigned to a specific movie review. */
export const setRatings = async (
    {adminID, reviewID, message, rating}: SetRatingsConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findByIdAndUpdate(reviewID, {rating}, {new: true}).orFail();
    await writeMovieReviewModLog({reviewID, action: "MOD_SET_RATING", admin: adminID, message});
    return review;
};