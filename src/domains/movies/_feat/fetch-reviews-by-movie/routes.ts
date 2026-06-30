/**
 * @file Movie review browse route registrations.
 * @filename MovieBrowseRoutes.ts
 */

import { Router } from "express";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import isAuth from "@/domains/authentication/middleware/isAuth";
import * as MovieBrowseController from "@/domains/movies/_feat/fetch-reviews-by-movie/controller";

const router = Router();

/**
 * Route for paginated movie reviews.
 */
router.get(
    "/item/:_id/reviews",
    [isAuth],
    asyncHandler(MovieBrowseController.getReviewsByMovie),
);

/**
 * Route for paginated reviews with aggregate stats and user review.
 */
router.get(
    "/item/:_id/reviews/details",
    [isAuth],
    asyncHandler(MovieBrowseController.getReviewDetailsByMovie),
);

/**
 * Route for featured movie reviews.
 */
router.get(
    "/item/:_id/reviews/featured",
    [isAuth],
    asyncHandler(MovieBrowseController.getFeaturedReviewsByMovie),
);

export {
    router as ReviewsByMovieRoutes,
};