/**
 * @fileoverview Express router for administrative theatre view data aggregation.
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
    getFetchTheatreScreenViewData, getFetchTheatreShowingListViewData
} from "@domains/theatre/_feat/admin-view-data/controller";
import {
    TheatreDetailsViewRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreDetailsViewRouteConfigSchema";
import {
    TheatreShowingListRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreShowingListRouteConfigSchema";

const router = Router();

router.get(
    '/item/:theatreSlug/screen/:screenSlug/details',
    [isAuth, validateRequestConfig({schema: TheatreScreenViewRouteConfigSchema})],
    asyncHandler(getFetchTheatreScreenViewData)
);

router.get(
    '/item/:slug/details',
    [isAuth, validateRequestConfig({schema: TheatreDetailsViewRouteConfigSchema})],
    asyncHandler(getFetchTheatreDetailsViewData)
);

router.get(
    '/item/:slug/showings/list',
    [isAuth, validateRequestConfig({schema: TheatreShowingListRouteConfigSchema})],
    asyncHandler(getFetchTheatreShowingListViewData)
);

/**
 * Router containing administrative theatre and screen data endpoints.
 */
export {
    router as TheatreAdminViewDataRoutes
};