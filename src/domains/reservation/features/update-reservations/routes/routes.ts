/**
 * @file Express router defining update operations for the Reservation domain.
 * @filename routes.ts
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {ReservationNotesInputSchema} from "@domains/reservation/features/update-reservations/schemas";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {patchUpdateReservationNotes} from "@domains/reservation/features/update-reservations/controller";

/**
 * Router instance for reservation update endpoints.
 */
const routes = Router();

/**
 * PATCH /api/v1/admin/reservations/feat/update/:_id/notes
 * ---
 * Updates the administrative or user-provided notes for a specific reservation record.
 */
routes.patch(
    "/update/:_id/notes",
    [isAuth, validateZodSchema(ReservationNotesInputSchema)],
    asyncHandler(patchUpdateReservationNotes),
);

export {
    routes as ReservationUpdateRoutes
}