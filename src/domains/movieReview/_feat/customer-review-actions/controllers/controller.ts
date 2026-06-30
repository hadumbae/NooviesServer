/**
 * @fileoverview Express controllers for administrative movie review moderation actions.
 */

import {
    resetDisplayName,
    resetLikes,
    setRatings,
    toggleReviewPublicity
} from "@/domains/movieReview/_feat/customer-review-actions/services/service";
import type {Request, Response} from "express";
import {fetchAuthAdmin} from "@/shared/_feat/admin-users/utils/fetchAuthAdmin";
import type {AdminModerationMessageInputData} from "@/shared/_feat/admin-users/schema";
import type {ResetReviewDisplayNameInputData} from "@/domains/movieReview/_feat/customer-review-actions/validation";
import type {
    SetReviewRatingInputData
} from "@/domains/movieReview/_feat/customer-review-actions/validation/SetReviewRatingInputSchema";
import type {CustomerReviewIDRouteConfig} from "@/domains/movieReview/_feat/customer-review-actions";

/** Toggles the public visibility status of a specific movie review. */
export async function patchToggleReviewPublicity(
    req: Request, res: Response
): Promise<Response> {
    const admin = await fetchAuthAdmin({req});
    const {reviewID} = req.parsedConfig as CustomerReviewIDRouteConfig;

    const {message} = req.validatedBody as AdminModerationMessageInputData;

    const review = await toggleReviewPublicity({
        adminID: admin._id,
        reviewID,
        message,
    });

    return res.status(200).json(review);
}

/** Resets or updates the display name associated with a movie review. */
export async function patchResetDisplayName(
    req: Request, res: Response
): Promise<Response> {
    const admin = await fetchAuthAdmin({req});
    const {reviewID} = req.parsedConfig as CustomerReviewIDRouteConfig;

    const {message, displayName} = req.validatedBody as ResetReviewDisplayNameInputData;

    const review = await resetDisplayName({
        adminID: admin._id,
        reviewID,
        displayName,
        message,
    });

    return res.status(200).json(review);
}

/** Clears all helpful likes and votes from a specific movie review. */
export async function patchResetLikes(
    req: Request, res: Response
): Promise<Response> {
    const admin = await fetchAuthAdmin({req});
    const {reviewID} = req.parsedConfig as CustomerReviewIDRouteConfig;

    const {message} = req.validatedBody as AdminModerationMessageInputData;

    const review = await resetLikes({
        adminID: admin._id,
        reviewID,
        message,
    });

    return res.status(200).json(review);
}

/** Manually overrides the numeric star rating of a movie review. */
export async function patchSetRatings(
    req: Request, res: Response
): Promise<Response> {
    const admin = await fetchAuthAdmin({req});
    const {reviewID} = req.parsedConfig as CustomerReviewIDRouteConfig;

    const {message, rating} = req.validatedBody as SetReviewRatingInputData;

    const review = await setRatings({
        adminID: admin._id,
        reviewID,
        message,
        rating,
    });

    return res.status(200).json(review);
}