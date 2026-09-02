/**
 * @fileoverview Express router defining endpoints for homepage domain data retrieval.
 */

import {Router} from "express";
import {checkAuth} from "@/domains/authentication";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {HomepageViewDataRouteConfigSchema} from "@/domains/homepage/_feat/load-data";
import {getFetchHomepageViewData} from "@/domains/homepage/_feat/routing/getFetchHomepageViewData";

const router = Router();

router.get(
    "/home-page-data",
    [checkAuth, validateRequestConfig({schema: HomepageViewDataRouteConfigSchema})],
    asyncHandler(getFetchHomepageViewData),
);

/** Express router containing all endpoints related to homepage data. */
export {
    router as HomepageRoutes,
};