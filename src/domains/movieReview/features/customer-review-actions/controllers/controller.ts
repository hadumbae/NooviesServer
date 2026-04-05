/**
 * @file Express controllers for administrative movie review moderation actions.
 * @filename controllers.ts
 */

import {
    resetDisplayName,
    resetLikes,
    setRatings,
    toggleReviewPublicity
} from "@domains/movieReview/features/customer-review-actions/services/service";
import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import {fetchAuthAdmin} from "@shared/features/admin-users/utils/fetchAuthAdmin";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";
import type {AdminModerationMessageInputData} from "@shared/features/admin-users/schema";
import type {ResetReviewDisplayNameInputData} from "@domains/movieReview/features/customer-review-actions/validation";
import type {
    SetReviewRatingInputData
} from "@domains/movieReview/features/customer-review-actions/validation/SetReviewRatingInputSchema";
import {Types} from "mongoose";

/**
 * Internal helper to extract and validate the review ID from the request parameters.
 * @param req - The Express request object.
 * @returns {Types.ObjectId} A validated Mongoose ObjectId.
 */
const parseReviewID = (req: Request): Types.ObjectId => {
    const {reviewID} = req.params;
    return isValidObjectId(reviewID);
};

/**
 * Controller to toggle the 'isPublic' status of a review.
 */
export const patchToggleReviewPublicity: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const admin = await fetchAuthAdmin({req});
    const reviewID = parseReviewID(req);

    const {message} = req.validatedBody as AdminModerationMessageInputData;

    const review = await toggleReviewPublicity({
        adminID: admin._id,
        reviewID,
        message,
    });

    return res.status(200).json(review);
}

/**
 * Controller to manually reset or correct the reviewer's display name.
 */
export const patchResetDisplayName: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const admin = await fetchAuthAdmin({req});
    const reviewID = parseReviewID(req);

    const {message, displayName} = req.validatedBody as ResetReviewDisplayNameInputData;

    const review = await resetDisplayName({
        adminID: admin._id,
        reviewID,
        displayName,
        message,
    });

    return res.status(200).json(review);
}

/**
 * Controller to clear all 'helpful' likes/votes from a review.
 */
export const patchResetLikes: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const admin = await fetchAuthAdmin({req});
    const reviewID = parseReviewID(req);

    const {message} = req.validatedBody as AdminModerationMessageInputData;

    const review = await resetLikes({
        adminID: admin._id,
        reviewID,
        message,
    });

    return res.status(200).json(review);
}

/**
 * Controller to manually override the numeric star rating of a review.
 */
export const patchSetRatings: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const admin = await fetchAuthAdmin({req});
    const reviewID = parseReviewID(req);

    const {message, rating} = req.validatedBody as SetReviewRatingInputData;

    const review = await setRatings({
        adminID: admin._id,
        reviewID,
        message,
        rating,
    });

    return res.status(200).json(review);
}