/**
 * @file ReservationUtilityRoutes.ts
 *
 * Routes for reservation-related utility endpoints.
 *
 * These routes expose read-only, user-scoped utilities such as
 * paginated reservation history.
 *
 * All routes in this module require authentication.
 */

import {Router} from "express";
import isAuth from "../../authentication/middleware/isAuth.js";
import {fetchReservationsForUser} from "../controller/reservation/ReservationUtilityController.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";

const router = Router();

/**
 * Fetch paginated reservations for the authenticated user.
 *
 * @remarks
 * - Requires authentication via `isAuth`
 * - User identity is resolved from `req.authUserID`
 * - Pagination is controlled via query parameters (e.g. `page`, `perPage`)
 */
router.get(
    "/user/fetch-reservations",
    [isAuth],
    asyncHandler(fetchReservationsForUser),
);

export {
    router as ReservationUtilityRoutes,
};
