/**
 * @file Express router defining update and lifecycle operations for the Reservation domain.
 * @filename routes.ts
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {ReservationNotesInputSchema} from "@domains/reservation/features/update-reservations/schemas";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {
    patchUpdateReservationNotes,
    patchResetReservationExpiry, patchCancelReservation, patchRefundReservation
} from "@domains/reservation/features/update-reservations/controller";

/**
 * Router instance for reservation update endpoints.
 * Base prefix typically defined in the main app router (e.g., /api/v1/admin/reservations).
 */
const routes = Router();

/**
 * PATCH /api/v1/admin/reservations/feat/update/:_id/notes
 */
routes.patch(
    "/update/:_id/notes",
    [isAuth, validateZodSchema(ReservationNotesInputSchema)],
    asyncHandler(patchUpdateReservationNotes),
);

/**
 * PATCH /api/v1/admin/reservations/feat/update/:_id/expiry
 */
routes.patch(
    "/update/:_id/expiry",
    [isAuth],
    asyncHandler(patchResetReservationExpiry),
);

/**
 * PATCH /api/v1/admin/reservations/feat/update/:_id/cancel
 */
routes.patch(
    "/update/:_id/cancel",
    [isAuth, validateZodSchema(ReservationNotesInputSchema)],
    asyncHandler(patchCancelReservation),
);

/**
 * PATCH /api/v1/admin/reservations/feat/update/:_id/refund
 */
routes.patch(
    "/update/:_id/refund",
    [isAuth, validateZodSchema(ReservationNotesInputSchema)],
    asyncHandler(patchRefundReservation),
);

export {
    /** * Exported for inclusion in the administrative feature router.
     */
        routes as ReservationUpdateRoutes
}
