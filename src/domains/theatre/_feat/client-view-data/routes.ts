/**
 * @fileoverview Express router for handling client-facing theatre information data requests.
 */

import {Router} from "express";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {FetchTheatreInfoViewRouteConfigSchema} from "@domains/theatre/_feat/client-view-data/theatre-info/routeParams";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {getFetchTheatreInfoViewData} from "@domains/theatre/_feat/client-view-data/controller";
import isAuth from "@domains/authentication/middleware/isAuth";

const router = Router();

router.get(
    "/theatre/:theatreSlug/info-with-screens/:localDateString",
    [isAuth, validateRequestConfig({schema: FetchTheatreInfoViewRouteConfigSchema})],
    asyncHandler(getFetchTheatreInfoViewData),
);

export {
    router as TheatreClientViewDataRoutes,
}