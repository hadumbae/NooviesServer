/**
 * @file TicketRoutes.ts
 * Client-facing ticket reservation routes.
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";

import {ReserveTicketInputSchema} from "@/domains/reservations/_feat/reserve-tickets/schemas";
import {postReserveTickets} from "@/domains/reservations/_feat/reserve-tickets/controllers";

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
