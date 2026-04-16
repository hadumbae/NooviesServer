/**
 * @fileoverview Express routing definitions for public Genre view data.
 * Configures the endpoint for fetching a genre and its associated movies,
 * including authentication and request validation layers.
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {BrowseGenreWithMoviesRouteParamSchema} from "@domains/genre/_feat/client-view-data/schemas";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {getFetchGenreWithMovies} from "@domains/genre/_feat/client-view-data/controller";

const router = Router();

router.get(
    "/item/:slug/with-movies",
    [
        isAuth,
        validateRequestConfig({
            schema: BrowseGenreWithMoviesRouteParamSchema,
            errorMessage: "Invalid genre slug or pagination parameters."
        })
    ],
    asyncHandler(getFetchGenreWithMovies),
);

export {
    router as GenreClientViewDataRoutes,
};