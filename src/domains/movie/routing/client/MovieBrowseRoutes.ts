/**
 * @file Movie review browse route registrations.
 * @filename MovieBrowseRoutes.ts
 */

import { Router } from "express";
import isAuth from "../../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../../shared/utility/handlers/asyncHandler.js";
import * as MovieBrowseController from "../../controller/client/movie-browse-controller/MovieBrowseController.js";

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
    router as MovieBrowseRoutes,
};