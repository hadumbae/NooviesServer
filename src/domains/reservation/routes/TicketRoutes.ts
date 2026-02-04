/**
 * @file TicketRoutes.ts
 *
 * Express routes for ticket reservation workflows.
 *
 * Defines authenticated endpoints used during
 * client-side checkout and reservation creation.
 */

import {Router} from "express";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import {makeReservationForClient} from "../controller/ticket/TicketController.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import {ReserveTicketSubmitSchema} from "../schemas/reserve-ticket/ReserveTicket.submit.schema.js";

const router = Router();

/**
 * Creates a ticket reservation for the authenticated user.
 *
 * @remarks
 * Middleware execution order:
 * 1. {@link isAuth} – ensures the request is authenticated
 * 2. {@link validateZodSchema} – validates checkout payload
 * 3. {@link asyncHandler} – forwards async errors to the
 *    global error handler
 */
router.get(
    "/reserve",
    [isAuth, validateZodSchema(ReserveTicketSubmitSchema)],
    asyncHandler(makeReservationForClient),
);

export {
    router as TicketRoutes,
};
