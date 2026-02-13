/**
 * @file TicketRoutes.ts
 * Client-facing ticket reservation routes.
 */

import {Router} from "express";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import {
    cancelReservationForClient,
    checkoutReservationForClient,
    makeReservationForClient
} from "../controllers/TicketController.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import {ReserveTicketSubmitSchema} from "../schemas/reserve-ticket/ReserveTicket.submit.schema.js";

const router = Router();

/**
 * Initiates a reservation for the authenticated user.
 */
router.post(
    "/reserve",
    [isAuth, validateZodSchema(ReserveTicketSubmitSchema)],
    asyncHandler(makeReservationForClient),
);

/**
 * Completes checkout for an existing reservation.
 */
router.patch(
    "/checkout/:resID",
    [isAuth],
    asyncHandler(checkoutReservationForClient),
);

/**
 * Cancels an existing reservation.
 */
router.patch(
    "/cancel/:resID",
    [isAuth],
    asyncHandler(cancelReservationForClient),
);

export {
    router as TicketRoutes,
};
