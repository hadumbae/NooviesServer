/**
 * @file Express router defining administrative endpoints for reservation retrieval.
 * @filename FetchRoutes.ts
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {getFetchByUniqueCode} from "@domains/reservation/features/fetch-reservations/admin/FetchController";

/**
 * Express Router instance for administrative Fetch operations.
 */
const routes = Router();

/**
 * GET /fetch-by-code/:code
 */
routes.get(
    "/fetch-by-code/:code",
    [isAuth],
    asyncHandler(getFetchByUniqueCode)
);

export {
    /** Exported as FetchRoutes to be mounted under the main reservation admin router. */
        routes as FetchRoutes,
}