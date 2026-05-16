/**
 * @fileoverview Express router defining endpoints for movie-related client view data.
 */

import {Router} from "express";
import isAuth from "src/domains/authentication/middleware/isAuth.js";
import asyncHandler from "src/shared/utility/handlers/asyncHandler.js";
import {
    getFetchGroupedCreditsWithMovie, getFetchMovieInfoOverviewViewData,
    getFetchShowingsWithMovie
} from "@domains/movie/_feat/client-view-data/controller";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {
    MovieInfoOverviewViewRouteConfigSchema
} from "src/domains/movie/_feat/client-view-data/schemas/MovieInfoOverviewViewRouteConfigSchema";

const router = Router();

router.get(
    "/item/:slug/info-overview",
    [isAuth, validateRequestConfig({schema: MovieInfoOverviewViewRouteConfigSchema})],
    asyncHandler(getFetchMovieInfoOverviewViewData),
);

router.get(
    "/item/:slug/info-credits",
    [isAuth],
    asyncHandler(getFetchGroupedCreditsWithMovie),
);

router.get(
    "/item/:slug/info-showings",
    [isAuth],
    asyncHandler(getFetchShowingsWithMovie),
);

/** Router handling movie client view data requests. */
export {
    router as MovieClientViewDataRoutes,
};