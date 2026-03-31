/**
 * @file API route definitions for client-side reservation queries.
 * @filename routes.ts
 */

import {Router} from "express";
import isAuth from "../../../../authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {fetchReservationsForUser} from "@domains/reservation/features/fetch-client-reservations/controllers";

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