/**
 * @fileoverview Express router for Genre view-specific data aggregation.
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication/_middleware/isAuth";
import {isAdmin} from "@/domains/authentication/_middleware/isAdmin";
import * as GenreAdminViewDataController from "./controller";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {
    GenreDetailsViewRouteConfigSchema
} from "@/domains/genres/_feat/admin-view-data/schemas/GenreDetailsViewRouteConfigSchema";

const router = Router();

/**
 * GET /item/:slug/details
 * Aggregates genre metadata and associated movie pagination for admin views.
 */
router.get(
    "/item/:slug/details",
    [isAuth, isAdmin, validateRequestConfig({schema: GenreDetailsViewRouteConfigSchema})],
    asyncHandler(GenreAdminViewDataController.getFetchGenreDetailsViewData),
);

export {router as GenreViewDataRoutes};