/**
 * @file API route definitions for client-side reservation queries.
 * @filename routes.ts
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {fetchReservationsForUser} from "@/domains/reservations/_feat/fetch-client-reservations/controllers";
import {parseQueryFilters, parseQuerySorts} from "@/shared/_feat";
import {Reservation} from "@/domains/reservations/_model";
import {
    CurrentUserReservationQueryFilterSchema,
    CurrentUserReservationQuerySortSchema,
} from "@/domains/reservations/_feat/fetch-client-reservations/current-user-reservations";

const router = Router();
const modelName = Reservation.modelName;

/**
 * GET `/user/fetch-reservations`
 */
router.get(
    "/user/paginated",
    [
        isAuth,
        parseQueryFilters({modelName, schema: CurrentUserReservationQueryFilterSchema}),
        parseQuerySorts({modelName, schema: CurrentUserReservationQuerySortSchema}),
    ],
    asyncHandler(fetchReservationsForUser),
);

export {
    router as FetchClientReservationRoutes,
};