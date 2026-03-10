/**
 * @file Registers routes for movie view data endpoints.
 * @filename MovieViewDataRoutes.ts
 */

import {Router} from "express";
import isAuth from "../../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../../shared/utility/handlers/asyncHandler.js";
import * as BrowseMovieCreditsController from "../../../movieCredit/controllers/client/BrowseMovieCreditsController.js";

const router = Router();

/**
 * Movie credits and related view data routes.
 */
router.get(
    "/:slug/credits",
    [isAuth],
    asyncHandler(BrowseMovieCreditsController.getFetchGroupedCreditsWithMovie)
);

export {
    router as MovieViewDataRoutes,
}