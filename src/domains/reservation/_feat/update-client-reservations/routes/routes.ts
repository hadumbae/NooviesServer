/**
 * @fileoverview Express router for client-facing reservation update operations.
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";

import {
    patchCancelClientReservation,
    patchCheckoutClientReservation,
} from "@domains/reservation/_feat/update-client-reservations/controllers";

const router = Router();

/**
 * Completes checkout for an existing reservation.
 */
router.patch(
    "/checkout/:resID",
    [isAuth],
    asyncHandler(patchCheckoutClientReservation),
);

/**
 * Cancels an existing reservation.
 */
router.patch(
    "/cancel/:resID",
    [isAuth],
    asyncHandler(patchCancelClientReservation),
);

/** Router handling client reservation updates including checkout and cancellation. */
export {
    router as UpdateClientReservationRoutes,
};
