/**
 * @file API route definitions for client-side reservation queries.
 * @filename routes.ts
 */

import {Router} from "express";
import isAuth from "@/domains/authentication/middleware/isAuth";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {fetchReservationsForUser} from "@/domains/reservations/_feat/fetch-client-reservations/controllers";

const router = Router();

/**
 * GET `/user/fetch-reservations`
 */
router.get(
    "/user/paginated",
    [isAuth],
    asyncHandler(fetchReservationsForUser),
);

export {
    router as FetchClientReservationRoutes,
};