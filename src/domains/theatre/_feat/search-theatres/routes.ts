/**
 * @fileoverview Express router for public theatre search and discovery endpoints.
 */

import { Router } from "express";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import { getFetchTheatresByLocation } from "@/domains/theatre/_feat/search-theatres/controller";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {
    TheatresByLocationRouteConfigSchema
} from "@/domains/theatre/_feat/search-theatres/schemas/TheatresByLocationRouteConfigSchema";

const router = Router();

/**
 * Route for location-based theatre searches with support for pagination and movie showings.
 */
router.get(
    "/search/by-location/paginated",
    [isAuth, validateRequestConfig({schema: TheatresByLocationRouteConfigSchema})],
    asyncHandler(getFetchTheatresByLocation),
);

export {
    router as TheatreSearchRoutes,
};