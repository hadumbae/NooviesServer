/**
 * @file Route definitions for movie browse endpoints.
 * MovieBrowseRoutes.ts
 */

import {Router} from "express";
import isAuth from "../../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../../shared/utility/handlers/asyncHandler.js";
import * as MovieBrowseController from "../../controller/client/movie-browse-controller/MovieBrowseController.js";

const router = Router();

/**
 * Review retrieval route for a movie.
 */
router.get(
    "/item/:_id/reviews",
    [isAuth],
    asyncHandler(MovieBrowseController.getReviewsByMovie),
);

export {
    router as MovieBrowseRoutes
}