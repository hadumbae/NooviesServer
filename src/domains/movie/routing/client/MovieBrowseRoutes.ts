/**
 * @file Movie browse route registrations.
 * MovieBrowseRoutes.ts
 */

import {Router} from "express";
import isAuth from "../../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../../shared/utility/handlers/asyncHandler.js";
import * as MovieBrowseController from "../../controller/client/movie-browse-controller/MovieBrowseController.js";

const router = Router();

/**
 * Registers movie review browse endpoints.
 */
router.get(
    "/item/:_id/reviews",
    [isAuth],
    asyncHandler(MovieBrowseController.getReviewsByMovie),
);

/**
 * Registers detailed movie review browse endpoint.
 */
router.get(
    "/item/:_id/reviews/details",
    [isAuth],
    asyncHandler(MovieBrowseController.getReviewDetailsByMovie),
);

export {
    router as MovieBrowseRoutes
}