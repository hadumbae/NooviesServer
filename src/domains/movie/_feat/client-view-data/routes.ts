/**
 * @fileoverview Express router defining endpoints for movie-related client view data.
 */

import {Router} from "express";
import isAuth from "src/domains/authentication/middleware/isAuth.js";
import asyncHandler from "src/shared/utility/handlers/asyncHandler.js";
import {
    getFetchGroupedCreditsWithMovie, getFetchMovieInfoViewData,
    getFetchShowingsWithMovie
} from "@domains/movie/_feat/client-view-data/controller";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {
    MovieInfoViewRouteConfigSchema
} from "@domains/movie/_feat/client-view-data/schemas/MovieInfoViewRouteConfigSchema";

const router = Router();

router.get(
    "/item/:slug/movie-info",
    [isAuth, validateRequestConfig({schema: MovieInfoViewRouteConfigSchema})],
    asyncHandler(getFetchMovieInfoViewData),
);

router.get(
    "/item/:slug/credits",
    [isAuth],
    asyncHandler(getFetchGroupedCreditsWithMovie),
);

router.get(
    "/item/:slug/showings",
    [isAuth],
    asyncHandler(getFetchShowingsWithMovie),
);

router.get(
    "/item/:slug/showings",
    [isAuth],
    asyncHandler(getFetchShowingsWithMovie),
);

/** Router handling movie client view data requests. */
export {
    router as MovieClientViewDataRoutes,
};