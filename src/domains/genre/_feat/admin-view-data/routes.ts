/**
 * @fileoverview Express router for Genre view-specific data aggregation.
 */

import {Router} from "express";
import isAuth from "../../../authentication/middleware/isAuth";
import * as GenreAdminViewDataController from "./controller";
import asyncHandler from "@shared/utility/handlers/asyncHandler";

const router = Router();

/**
 * GET /item/:slug/details
 * Aggregates genre metadata and associated movie pagination for admin views.
 */
router.get(
    "/item/:slug/details",
    [isAuth],
    asyncHandler(GenreAdminViewDataController.getFetchGenreDetailsVeiwData),
);

export {router as GenreViewDataRoutes};