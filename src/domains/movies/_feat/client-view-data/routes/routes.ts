/**
 * @fileoverview Express router defining endpoints for movie-related client view data.
 */

import {Router} from "express";
import isAuth from "@/domains/authentication/middleware/isAuth.js";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {MovieInfoOverviewViewRouteConfigSchema} from "@/domains/movies/_feat/client-view-data/movie-overview";
import {MovieInfoCreditsViewRouteConfigSchema} from "@/domains/movies/_feat/client-view-data/movie-credits";
import {MovieInfoShowingsViewRouteConfigSchema} from "@/domains/movies/_feat/client-view-data/movie-showings";
import {MovieInfoReviewsViewRouteConfigSchema} from "@/domains/movies/_feat/client-view-data/movie-reviews";
import {
    getFetchMovieInfoCreditsViewData,
    getFetchMovieInfoOverviewViewData,
    getFetchMovieInfoReviewsViewData,
    getFetchMovieInfoShowingsViewData
} from "@/domains/movies/_feat/client-view-data/controller";

const router = Router();

router.get(
    "/item/:slug/info-overview",
    [isAuth, validateRequestConfig({schema: MovieInfoOverviewViewRouteConfigSchema})],
    asyncHandler(getFetchMovieInfoOverviewViewData),
);

router.get(
    "/item/:slug/info-reviews",
    [isAuth, validateRequestConfig({schema: MovieInfoReviewsViewRouteConfigSchema})],
    asyncHandler(getFetchMovieInfoReviewsViewData),
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