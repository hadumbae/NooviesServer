/**
 * @fileoverview Express router defining endpoints for updating, canceling, and refunding reservations.
 */

import {Router} from "express";
import isAuth from "@/domains/authentication/middleware/isAuth";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import {ReservationNotesInputSchema} from "src/domains/reservations/_feat/update-reservations/schemas";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {
    patchCancelReservation,
    patchRefundReservation,
    patchResetReservationExpiry,
    patchUpdateReservationNotes
} from "src/domains/reservations/_feat/update-reservations/controller";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {IDRouteConfigSchema} from "@/shared/_schema";

const routes = Router();

routes.patch(
    "/update/:_id/notes",
    [
        isAuth,
        validateRequestConfig({schema: IDRouteConfigSchema}),
        validateZodSchema(ReservationNotesInputSchema),
    ],
    asyncHandler(patchUpdateReservationNotes),
);

routes.patch(
    "/update/:_id/expiry",
    [
        isAuth,
        validateRequestConfig({schema: IDRouteConfigSchema}),
    ],
    asyncHandler(patchResetReservationExpiry),
);

routes.patch(
    "/update/:_id/cancel",
    [
        isAuth,
        validateRequestConfig({schema: IDRouteConfigSchema}),
        validateZodSchema(ReservationNotesInputSchema),
    ],
    asyncHandler(patchCancelReservation),
);

routes.patch(
    "/update/:_id/refund",
    [
        isAuth,
        validateRequestConfig({schema: IDRouteConfigSchema}),
        validateZodSchema(ReservationNotesInputSchema),
    ],
    asyncHandler(patchRefundReservation),
);

/** Express router instance for reservation update operations. */
export {
        routes as ReservationUpdateRoutes
}
