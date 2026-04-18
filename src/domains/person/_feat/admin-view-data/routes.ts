/**
 * @fileoverview Route definitions for administrative Person view data.
 * Mounts specialized aggregation endpoints for comprehensive person profiles.
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {PersonDetailsViewRouteConfigSchema} from "@domains/person/_feat/admin-view-data/routeSchemas";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {getFetchPersonDetailsViewData} from "@domains/person/_feat/admin-view-data/controller";

/**
 * Route definitions for administrative Person view data.
 */
const router = Router();

router.get(
    '/item/:slug/person-details',
    [isAuth, validateRequestConfig({schema: PersonDetailsViewRouteConfigSchema})],
    asyncHandler(getFetchPersonDetailsViewData),
);

export {
    router as PersonAdminViewDataRoutes,
};