/**
 * @file TicketRoutes.ts
 * Client-facing ticket reservation routes.
 */

import {Router} from "express";
import isAuth from "../../../../authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";

import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {ReserveTicketInputSchema} from "@domains/reservation/features/reserve-tickets/schemas/inputSchema";

import {postReserveTickets} from "@domains/reservation/features/reserve-tickets/controllers";

const router = Router();

/**
 * Initiates a reservation for the authenticated user.
 */
router.post(
    "/reserve",
    [isAuth, validateZodSchema(ReserveTicketInputSchema)],
    asyncHandler(postReserveTickets),
);


export {
    router as ReserveTicketsRoutes,
};
