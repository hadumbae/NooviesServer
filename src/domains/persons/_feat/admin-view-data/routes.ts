/**
 * @fileoverview Route definitions for administrative Person view data.
 * Mounts specialized aggregation endpoints for comprehensive person profiles.
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication/_middleware/isAuth";
import {isAdmin} from "@/domains/authentication/_middleware/isAdmin";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {PersonDetailsViewRouteConfigSchema} from "@/domains/persons/_feat/admin-view-data/routeSchemas";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {getFetchPersonDetailsViewData} from "@/domains/persons/_feat/admin-view-data/controller";

/**
 * Route definitions for administrative Person view data.
 */
const router = Router();

router.get(
    '/item/:slug/person-details',
    [isAuth, isAdmin, validateRequestConfig({schema: PersonDetailsViewRouteConfigSchema})],
    asyncHandler(getFetchPersonDetailsViewData),
);

export {
    router as PersonAdminViewDataRoutes,
};