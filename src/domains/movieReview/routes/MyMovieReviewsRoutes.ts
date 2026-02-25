/**
 * @file Routes for current user MovieReview operations.
 * MyMovieReviewsRoutes.ts
 */

import {Router} from "express";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import * as MyMovieReviewController from "../controllers/MyMovieReviewController.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import {MovieReviewCreateInputSchema} from "../schema/MovieReviewCreateInputSchema.js";
import {MovieReviewUpdateInputSchema} from "../schema/MovieReviewUpdateInputSchema.js";

const router = Router();

router.get(
    "/current/fetch",
    [isAuth],
    asyncHandler(MyMovieReviewController.getFetchCurrentUserMovieReview),
);

router.post(
    "/current/create",
    [isAuth, validateZodSchema(MovieReviewCreateInputSchema)],
    asyncHandler(MyMovieReviewController.postCreateMovieReviewForCurrentUser),
);

router.post(
    "/current/update/:reviewID",
    [isAuth, validateZodSchema(MovieReviewUpdateInputSchema)],
    asyncHandler(MyMovieReviewController.patchUpdateMovieReviewForCurrentUser),
);

export {
    router as MyMovieReviewsRoutes
}