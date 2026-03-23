/**
 * @file Express router for retrieving aggregated Genre view-specific data.
 * @filename GenreViewDataRoutes.ts
 */

import {Router} from "express";
import isAuth from "../../authentication/middleware/isAuth.js";
import * as GenreAdminViewDataController from "../controllers/views/GenreAdminViewDataController.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";

/** * Router instance for Genre View Data endpoints.
 */
const router = Router();

/**
 * GET /view-data/item/:slug/details
 * Fetches combined genre metadata and a paginated list of associated movies for administrative views.
 */
router.get(
    "/view-data/item/:slug/details",
    [isAuth],
    asyncHandler(GenreAdminViewDataController.getFetchGenreDetailsVeiwData),
);

export {
    router as GenreViewDataRoutes
}