/**
 * @file TicketRoutes.ts
 * Client-facing ticket reservation routes.
 */

import {Router} from "express";
import isAuth from "../../../../authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";

import {
    patchCancelClientReservation,
    patchCheckoutClientReservation,
} from "@domains/reservation/features/client-reservations/controllers";


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

export {
    router as UpdateClientReservationRoutes,
};
