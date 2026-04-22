/**
 * @fileoverview Express router for public theatre search and discovery endpoints.
 */

import { Router } from "express";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import { getFetchTheatresByLocation } from "@domains/theatre/_feat/search-theatres/controller";

const router = Router();

/**
 * Route for location-based theatre searches with support for pagination and movie showings.
 */
router.get(
    "/search/by-location/paginated",
    asyncHandler(getFetchTheatresByLocation),
);

export {
    router as TheatreSearchRoutes,
};