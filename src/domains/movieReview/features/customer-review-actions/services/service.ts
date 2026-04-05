// src/domains/movieReview/features/customer-review-actions/services/service.ts

// Toggle Publicity

import type {
    ToggleReviewPublicityConfig
} from "@domains/movieReview/features/customer-review-actions/services/service.types";
import {MovieReview} from "@domains/movieReview/model/MovieReview.model";
import createHttpError from "http-errors";
import {MovieReviewModerationLog} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.model";
import type {MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types";

const toggleReviewPublicity = async (
    {adminID, reviewID, message}: ToggleReviewPublicityConfig
): Promise<MovieReviewSchemaFields> => {
    const review = await MovieReview.findById(reviewID);

    if (!review) {
        throw createHttpError(404, "Failed to toggle publicity. Movie Review not found.");
    }

    const log = new MovieReviewModerationLog({
        action: "MOD_TOGGLE_PUBLICITY",
        admin: adminID,
        modDate: new Date(),
        message,
    });

    try {
        await log.validate();
    } catch (error: unknown) {
        console.error("Failed to write log.");
        console.error("Error: ", error);

        throw createHttpError(500, "Failed to toggle publicity. Please try again later.");
    }

    review.isPublic = !review.isPublic;
    review.moderationLogs.push(log);
    await review.save();

    return review;
}

// Reset Display Name

// Reset Likes

// Set Ratings