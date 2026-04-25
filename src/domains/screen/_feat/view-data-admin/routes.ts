/**
 * @fileoverview Express router for administrative Theatre Screen view data.
 * Handles specialized data aggregation routes required for screen management UIs.
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {
    TheatreScreenDetailsViewRouteConfigSchema
} from "@domains/screen/_feat/view-data-admin/schemas/TheatreScreenDetailsViewRouteConfigSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {getFetchTheatreScreenDetailsViewData} from "@domains/screen/_feat/view-data-admin/controller";

const router = Router();

router.get(
    '/theatre/:theatreSlug/screen/:screenSlug/details',
    [isAuth, validateRequestConfig({schema: TheatreScreenDetailsViewRouteConfigSchema})],
    asyncHandler(getFetchTheatreScreenDetailsViewData)
);

export {
    router as TheatreScreenAdminViewDataRoutes
};