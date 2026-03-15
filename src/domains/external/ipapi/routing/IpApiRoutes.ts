/**
 * @file Express routes for IP-based geolocation endpoints.
 * @filename IpApiRoutes.ts
 */

import {Router} from "express";
import asyncHandler from "../../../../shared/utility/handlers/asyncHandler.js";
import {fetchIpApiGeoData} from "../controllers/IpApiController.js";
import isAuth from "../../../authentication/middleware/isAuth.js";

const router = Router();

/**
 * Retrieves geolocation data for the requesting IP.
 *
 * Middleware:
 * - `isAuth` – ensures the request is authenticated.
 * - `asyncHandler` – forwards async errors to Express error handling.
 */
router.get(
    "/get-geolocation",
    [isAuth],
    asyncHandler(fetchIpApiGeoData),
);

/** Router exposing IP geolocation endpoints. */
export {
    router as IpApiRoutes
};