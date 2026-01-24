/**
 * @file TheatreBrowseRoutes.ts
 *
 * Public routing module for theatre browse endpoints.
 *
 * Wires HTTP routes to the {@link TheatreBrowseController}
 * via {@link TheatreServiceProvider}, with centralized async
 * error handling applied.
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
 * GET /theatres-by-location/:target/paginated
 *
 * Returns paginated theatres that contain scheduled showings.
 *
 * Filtering:
 * - Location matching is performed using the `target` path parameter
 *
 * Pagination:
 * - Page and size are controlled via query parameters
 */
router.get(
    "/theatres-by-location/:target/paginated",
    asyncHandler(browseController.fetchPaginatedTheatresWithShowings.bind(browseController)),
);

export {
    router as TheatreBrowseRoutes,
};
