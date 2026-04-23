/**
 * @fileoverview Express router for administrative theatre view data aggregation.
 * Provides endpoints for fetching composite data objects required for theatre and screen management.
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {
    TheatreScreenViewRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreScreenViewRouteConfigSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {
    getFetchTheatreDetailsViewData,
    getFetchTheatreScreenViewData
} from "@domains/theatre/_feat/admin-view-data/controller";
import {
    TheatreDetailsViewRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreDetailsViewRouteConfigSchema";

const router = Router();

/**
 * GET /item/:theatreSlug/screen/:screenSlug/details
 * * Aggregates data for specific screen management, including theatre metadata and seat grid.
 */
router.get(
    '/item/:theatreSlug/screen/:screenSlug/details',
    [
        isAuth,
        validateRequestConfig({schema: TheatreScreenViewRouteConfigSchema})
    ],
    asyncHandler(getFetchTheatreScreenViewData)
);

/**
 * GET /item/:theatreSlug/details
 * * Aggregates high-level theatre details, paginated screens, and recent showings.
 */
router.get(
    '/item/:theatreSlug/details',
    [
        isAuth,
        validateRequestConfig({schema: TheatreDetailsViewRouteConfigSchema})
    ],
    asyncHandler(getFetchTheatreDetailsViewData)
);

export {
    router as TheatreAdminViewDataRoutes
};