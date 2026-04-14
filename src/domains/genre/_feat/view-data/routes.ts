/**
 * @fileoverview Express router for Genre view-specific data aggregation.
 */

import {Router} from "express";
import isAuth from "../../../authentication/middleware/isAuth";
import * as GenreAdminViewDataController from "./controller";
import asyncHandler from "@shared/utility/handlers/asyncHandler";

const router = Router();

/**
 * GET /view-data/item/:slug/details
 * Aggregates genre metadata and associated movie pagination for admin views.
 */
router.get(
    "/view-data/item/:slug/details",
    [isAuth],
    asyncHandler(GenreAdminViewDataController.getFetchGenreDetailsVeiwData),
);

export {router as GenreViewDataRoutes};