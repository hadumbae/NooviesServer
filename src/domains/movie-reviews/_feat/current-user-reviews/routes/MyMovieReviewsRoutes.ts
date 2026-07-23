/**
 * @fileoverview Express router defining endpoints for the current user to manage their movie reviews.
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication/middleware/isAuth.js";
import asyncHandler from "@/shared/utility/handlers/asyncHandler.js";
import * as MyMovieReviewController from "@/domains/movie-reviews/_feat/current-user-reviews/controller";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema.js";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {MyReviewIDRouteConfigSchema} from "@/domains/movie-reviews/_feat/current-user-reviews/schema/MyReviewIDRouteConfigSchema";
import {MovieReviewCreateInputSchema, MovieReviewUpdateInputSchema} from "@/domains/movie-reviews/_feat/validate-submit/schemas";

const router = Router();

router.get(
    "/current/fetch",
    [isAuth],
    asyncHandler(MyMovieReviewController.getFetchCurrentUserMovieReviewList),
);

router.get(
    "/current/fetch/:reviewID",
    [
        isAuth,
        validateRequestConfig({schema: MyReviewIDRouteConfigSchema}),
    ],
    asyncHandler(MyMovieReviewController.getFetchCurrentUserMovieReview),
);

router.post(
    "/current/create",
    [
        isAuth,
        validateZodSchema(MovieReviewCreateInputSchema),
    ],
    asyncHandler(MyMovieReviewController.postCreateMovieReviewForCurrentUser),
);

router.patch(
    "/current/update/:reviewID",
    [
        isAuth,
        validateRequestConfig({schema: MyReviewIDRouteConfigSchema}),
        validateZodSchema(MovieReviewUpdateInputSchema),
    ],
    asyncHandler(MyMovieReviewController.patchUpdateMovieReviewForCurrentUser),
);

router.delete(
    "/current/delete/:reviewID",
    [
        isAuth,
        validateRequestConfig({schema: MyReviewIDRouteConfigSchema}),
    ],
    asyncHandler(MyMovieReviewController.deleteRemoveMovieReviewForCurrentUser),
);

/** Router instance containing movie review management routes for the authenticated user. */
export {
    router as MyMovieReviewsRoutes
};