/**
 * @fileoverview Express router defining endpoints for movie-related client view data.
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth.js";
import {
    getFetchMovieInfoCreditsViewData,
    getFetchMovieInfoOverviewViewData,
    getFetchMovieInfoShowingsViewData
} from "@domains/movie/_feat/client-view-data/controller";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {
    MovieInfoOverviewViewRouteConfigSchema
} from "@domains/movie/_feat/client-view-data/schemas/MovieInfoOverviewViewRouteConfigSchema";
import {
    MovieInfoCreditsViewRouteConfigSchema
} from "@domains/movie/_feat/client-view-data/schemas/MovieInfoCreditsViewRouteConfigSchema";
import {
    MovieInfoShowingsViewRouteConfigSchema
} from "@domains/movie/_feat/client-view-data/schemas/MovieInfoShowingsViewRouteConfigSchema";
import asyncHandler from "@/utility/handlers/asyncHandler";


const router = Router();

router.get(
    "/item/:slug/info-overview",
    [isAuth, validateRequestConfig({schema: MovieInfoOverviewViewRouteConfigSchema})],
    asyncHandler(getFetchMovieInfoOverviewViewData),
);

router.get(
    "/item/:slug/info-credits",
    [isAuth, validateRequestConfig({schema: MovieInfoCreditsViewRouteConfigSchema})],
    asyncHandler(getFetchMovieInfoCreditsViewData),
);

router.get(
    "/item/:slug/info-showings",
    [isAuth, validateRequestConfig({schema: MovieInfoShowingsViewRouteConfigSchema})],
    asyncHandler(getFetchMovieInfoShowingsViewData),
);

/** Router handling movie client view data requests. */
export {
    router as MovieClientViewDataRoutes,
};