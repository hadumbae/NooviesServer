/**
 * @file HTTP controllers for current-user MovieReview routes.
 * MyMovieReviewController.ts
 */

import type {ControllerAsyncFunc} from "../../../shared/types/ControllerTypes.js";
import type {Request, Response} from "express";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import * as MyMovieReviewService from "../services/MyMovieReviewService.js";
import {fetchRequestUser} from "../../../shared/utility/request/fetchRequestUser.js";
import type {MovieReviewCreateInputData} from "../schema/MovieReviewCreateInputSchema.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import type {MovieReviewUpdateInputData} from "../schema/MovieReviewUpdateInputSchema.js";

/**
 * Returns paginated MovieReviews owned by the authenticated user.
 */
export const getFetchCurrentUserMovieReview: ControllerAsyncFunc = async (
    req: Request, res: Response
) => {
    const userID = fetchRequestUser(req);
    const {page, perPage} = QueryUtils.fetchPaginationFromQuery(req);
    const {populate, virtuals} = QueryUtils.fetchOptionsFromQuery(req);

    const data = await MyMovieReviewService.fetchCurrentUserMovieReviews({
        userID,
        page,
        perPage,
        options: {populate, virtuals},
    });

    return res
        .status(200)
        .json(data);
}

/**
 * Creates a MovieReview for the authenticated user.
 */
export const postCreateMovieReviewForCurrentUser: ControllerAsyncFunc = async (
    req: Request, res: Response
) => {
    const userID = fetchRequestUser(req);
    const {populate, virtuals} = QueryUtils.fetchOptionsFromQuery(req);

    const data = req.validatedBody as MovieReviewCreateInputData;

    const review = await MyMovieReviewService.createMovieReviewForCurrentUser({
        userID,
        data,
        options: {populate, virtuals},
    });

    return res
        .status(200)
        .json(review);
}

/**
 * Updates a MovieReview owned by the authenticated user.
 *
 * Ownership and conflict handling are enforced at the service layer.
 */
export const patchUpdateMovieReviewForCurrentUser: ControllerAsyncFunc = async (
    req: Request, res: Response
) => {
    const userID = fetchRequestUser(req);
    const {populate, virtuals} = QueryUtils.fetchOptionsFromQuery(req);

    const {reviewID} = req.params;
    const revID = isValidObjectId(reviewID);

    const data = req.validatedBody as MovieReviewUpdateInputData;
    const unset = req.unsetFields;

    const review = await MyMovieReviewService.updateMovieReviewForCurrentUser({
        userID,
        reviewID: revID,
        data,
        unset,
        options: {populate, virtuals},
    });

    return res
        .status(200)
        .json(review);
}

/**
 * Deletes a MovieReview owned by the authenticated user.
 */
export const deleteRemoveMovieReviewForCurrentUser: ControllerAsyncFunc = async (
    req: Request, res: Response
) => {
    const userID = fetchRequestUser(req);

    const {reviewID} = req.params;
    const revID = isValidObjectId(reviewID);

    await MyMovieReviewService.deleteMovieReviewForCurrentUser({
        userID,
        reviewID: revID,
    });

    return res
        .status(200)
        .json({message: "Movie Review deleted."});
}