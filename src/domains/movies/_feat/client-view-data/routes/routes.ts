/**
 * @fileoverview Express router defining endpoints for movie-related client view data.
 */

import {Router} from "express";
import isAuth from "@/domains/authentication/middleware/isAuth.js";
import {
    getFetchMovieInfoCreditsViewData,
    getFetchMovieInfoOverviewViewData,
    getFetchMovieInfoShowingsViewData
} from "@/domains/movies/_feat/client-view-data/controller/controller";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {
    MovieInfoOverviewViewRouteConfigSchema
} from "@/domains/movies/_feat/client-view-data/movie-overview/MovieInfoOverviewViewRouteConfigSchema";
import {
    MovieInfoCreditsViewRouteConfigSchema
} from "@/domains/movies/_feat/client-view-data/movie-credits/MovieInfoCreditsViewRouteConfigSchema";
import {
    MovieInfoShowingsViewRouteConfigSchema
} from "@/domains/movies/_feat/client-view-data/movie-showings/MovieInfoShowingsViewRouteConfigSchema";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";


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