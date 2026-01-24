/**
 * @file TheatreBrowseRoutes.ts
 *
 * Public routing module for theatre browsing endpoints.
 *
 * Wires HTTP routes to the `TheatreBrowseController` via
 * `TheatreServiceProvider`, with async error handling applied.
 */

import {Router} from "express";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import TheatreServiceProvider from "../provider/TheatreServiceProvider.js";

/**
 * Resolve controller dependencies for browse routes.
 */
const {
    controllers: {browseController},
} = TheatreServiceProvider.register();

const router = Router();

/**
 * GET /theatres-by-location/paginated
 *
 * Returns paginated theatres that have scheduled showings,
 * filtered by optional location query parameters.
 */
router.get(
    "/theatres-by-location/paginated",
    asyncHandler(
        browseController.fetchPaginatedTheatresWithShowings.bind(
            browseController,
        ),
    ),
);

export {
    router as TheatreBrowseRoutes,
};
