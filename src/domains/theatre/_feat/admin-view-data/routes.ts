/**
 * @fileoverview Express router for administrative theatre view data aggregation.
 */

import { Router } from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import { validateRequestConfig } from "@shared/utility/schema/validators/validateRequestConfig";
import {
    TheatreScreenViewRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreScreenViewRouteConfigSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import { getFetchTheatreScreenViewData } from "@domains/theatre/_feat/admin-view-data/controller";

const router = Router();

/**
 * Route to retrieve a composite data object for theatre screen management.
 * Requires authentication and validates theatre and screen slugs via TheatreScreenViewRouteConfigSchema.
 */
router.get(
    '/item/:theatreSlug/screen/:screenSlug/details',
    [
        isAuth,
        validateRequestConfig({ schema: TheatreScreenViewRouteConfigSchema }),
    ],
    asyncHandler(getFetchTheatreScreenViewData)
);

export {
    router as TheatreAdminViewDataRoutes
}