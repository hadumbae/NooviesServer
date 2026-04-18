/**
 * @fileoverview Route definitions for person-specific movie credit aggregations.
 */

import { Router } from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import { getFetchPersonFilmography } from "@domains/movieCredit/_feat/person-credits/controller";
import { validateRequestConfig } from "@shared/utility/schema/validators/validateRequestConfig";
import { FetchPersonFilmographyRouteConfigSchema } from "@domains/movieCredit/_feat/person-credits/routeSchemas";

const router = Router();

/**
 * GET /person/:personID/filmography/recent
 * Retrieves a person's credits grouped by role, filtered by a configurable limit.
 */
router.get(
    "/person/:personID/filmography/recent",
    [
        isAuth,
        validateRequestConfig({
            schema: FetchPersonFilmographyRouteConfigSchema,
            errorMessage: "Failed to validate config for fetching person's filmography.",
        }),
    ],
    asyncHandler(getFetchPersonFilmography),
);

export {
    router as PersonCreditRoutes
};