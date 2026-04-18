/**
 * @fileoverview Route definitions for person-specific movie credit aggregations.
 *
 * This file mounts endpoints for retrieving high-level career statistics and
 * detailed filmography data for individual person entities.
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {
    getFetchPersonCreditStats,
    getFetchPersonFilmography
} from "@domains/movieCredit/_feat/person-credits/controller";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {
    FetchPersonCreditStatsRouteConfigSchema,
    FetchPersonFilmographyRouteConfigSchema
} from "@domains/movieCredit/_feat/person-credits/routeSchemas";

const router = Router();

/**
 * GET /person/:personID/stats
 */
router.get(
    "/person/:personID/stats",
    [isAuth, validateRequestConfig({schema: FetchPersonCreditStatsRouteConfigSchema})],
    asyncHandler(getFetchPersonCreditStats),
);

/**
 * GET /person/:personID/filmography/recent
 */
router.get(
    "/person/:personID/filmography/recent",
    [isAuth, validateRequestConfig({schema: FetchPersonFilmographyRouteConfigSchema})],
    asyncHandler(getFetchPersonFilmography),
);

export {
    router as PersonCreditRoutes
};