/**
 * @file API route definitions for current-user MovieReview operations.
 * @filename MyMovieReviewsRoutes.ts
 */

import {Router} from "express";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import * as MyMovieReviewController from "../controllers/MyMovieReviewController.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import {MovieReviewCreateInputSchema} from "../schema/MovieReviewCreateInputSchema.js";
import {MovieReviewUpdateInputSchema} from "../schema/MovieReviewUpdateInputSchema.js";

const router = Router();

/**
 * @route GET /current/fetch
 * @description Retrieves a paginated list of reviews authored by the authenticated user.
 */
router.get(
    "/current/fetch",
    [isAuth],
    asyncHandler(MyMovieReviewController.getFetchCurrentUserMovieReviewList),
);

/**
 * @route GET /current/fetch/:reviewID
 * @description Retrieves a specific review by ID, belonging to the authenticated user.
 */
router.get(
    "/current/fetch/:reviewID",
    [isAuth],
    asyncHandler(MyMovieReviewController.getFetchCurrentUserMovieReview),
);

/**
 * @route POST /current/create
 * @description Creates a new movie review for the authenticated user.
 * @validation {@link MovieReviewCreateInputSchema}
 */
router.post(
    "/current/create",
    [isAuth, validateZodSchema(MovieReviewCreateInputSchema)],
    asyncHandler(MyMovieReviewController.postCreateMovieReviewForCurrentUser),
);

/**
 * @route PATCH /current/update/:reviewID
 * @description Updates an existing movie review authored by the current user.
 * @validation {@link MovieReviewUpdateInputSchema}
 */
router.patch(
    "/current/update/:reviewID",
    [isAuth, validateZodSchema(MovieReviewUpdateInputSchema)],
    asyncHandler(MyMovieReviewController.patchUpdateMovieReviewForCurrentUser),
);

/**
 * @route DELETE /current/delete/:reviewID
 * @description Removes a specific movie review authored by the current user.
 */
router.delete(
    "/current/delete/:reviewID",
    [isAuth],
    asyncHandler(MyMovieReviewController.deleteRemoveMovieReviewForCurrentUser),
);

export {
    /** * Router instance containing all current-user specific review endpoints.
     * Usually mounted under `/api/reviews`.
     */
        router as MyMovieReviewsRoutes
};