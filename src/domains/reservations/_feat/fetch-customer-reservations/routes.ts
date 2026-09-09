/**
 * @file Express router defining administrative endpoints for reservation retrieval.
 * @filename FetchRoutes.ts
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication/_middleware/isAuth";
import {isAdmin} from "@/domains/authentication/_middleware/isAdmin";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {getFetchByUniqueCode} from "@/domains/reservations/_feat/fetch-customer-reservations/controller";

/**
 * Express Router instance for administrative Fetch operations.
 */
const routes = Router();

/**
 * GET /fetch-by-code/:code
 */
routes.get(
    "/fetch-by-code/:code",
    [isAuth, isAdmin],
    asyncHandler(getFetchByUniqueCode)
);

export {
    /** Exported as FetchRoutes to be mounted under the main reservation admin router. */
        routes as FetchAdminReservationRoutes,
}