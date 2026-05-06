/**
 * @fileoverview Express router for Genre view-specific data aggregation.
 */

import {Router} from "express";
import isAuth from "../../../authentication/middleware/isAuth";
import * as GenreAdminViewDataController from "./controller";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {
    GenreDetailsViewRouteConfigSchema
} from "@domains/genre/_feat/admin-view-data/schemas/GenreDetailsViewRouteConfigSchema";

const router = Router();

/**
 * GET /item/:slug/details
 * Aggregates genre metadata and associated movie pagination for admin views.
 */
router.get(
    "/item/:slug/details",
    [isAuth, validateRequestConfig({schema: GenreDetailsViewRouteConfigSchema})],
    asyncHandler(GenreAdminViewDataController.getFetchGenreDetailsViewData),
);

export {router as GenreViewDataRoutes};