/**
 * @fileoverview Express routing definitions for movie-related view data.
 * Maps incoming client requests for aggregated movie information (credits and showings)
 * to their respective controllers, secured by authentication middleware.
 */

import {Router} from "express";
import isAuth from "../../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../../shared/utility/handlers/asyncHandler.js";
import * as BrowseMovieCreditsController from "../../../movieCredit/controllers/client/BrowseMovieCreditsController.js";
import * as BrowseShowingsController from "../../../showing/controllers/client/BrowseShowingsController.js";

const router = Router();

/**
 * GET /item/:slug/credits
 */
router.get(
    "/item/:slug/credits",
    [isAuth],
    asyncHandler(BrowseMovieCreditsController.getFetchGroupedCreditsWithMovie)
);

/**
 * GET /item/:slug/showings
 */
router.get(
    "/item/:slug/showings",
    [isAuth],
    asyncHandler(BrowseShowingsController.getFetchShowingsWithMovie)
);

export {
    router as MovieClientViewDataRoutes,
};