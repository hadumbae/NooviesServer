/**
 * @file Registers routes for movie view data endpoints.
 * @filename MovieViewDataRoutes.ts
 */

import {Router} from "express";
import isAuth from "../../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../../shared/utility/handlers/asyncHandler.js";
import * as BrowseMovieCreditsController from "../../../movieCredit/controllers/client/BrowseMovieCreditsController.js";
import * as BrowseShowingsController from "../../../showing/controllers/client/BrowseShowingsController.js";

const router = Router();

/**
 * Routes for retrieving movie-related view data.
 */
router.get(
    "/:slug/credits",
    [isAuth],
    asyncHandler(BrowseMovieCreditsController.getFetchGroupedCreditsWithMovie)
);

router.get(
    "/:slug/showings",
    [isAuth],
    asyncHandler(BrowseShowingsController.getFetchShowingsWithMovie)
);

export {
    router as MovieViewDataRoutes,
};