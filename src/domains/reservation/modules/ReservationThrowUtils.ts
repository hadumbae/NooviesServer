/**
 * @file ReservationThrowUtils.ts
 *
 * Guard utilities for reservation workflows.
 *
 * @description
 * Provides assertion-style helpers that validate reservation state
 * and throw domain-specific {@link BookingError}s when invariants
 * are violated.
 *
 * @remarks
 * - These functions are intended for service-layer usage.
 * - They enforce authorization and lifecycle constraints.
 * - Each function throws on failure and returns `void` on success.
 */

import type {ReservationSchemaFields} from "../model/reservation/Reservation.types.js";
import {calculateDateNow} from "../../../shared/utility/date/LuxonDateUtils.js";
import {BookingError} from "../../../shared/errors/reservations/BookingError.js";
import {Types} from "mongoose";
import Reservation from "../model/reservation/Reservation.model.js";
import type {ReservationDocument} from "../types/ReservationTypes.js";
import type {ReservationUserMismatchParams} from "./ReservationThrowUtils.types.js";

/**
 * Retrieves a reservation by its identifier or throws if not found.
 *
 * @param _id - The MongoDB ObjectId of the reservation
 * @returns A hydrated {@link ReservationDocument}
 *
 * @throws {@link BookingError}
 * Thrown when no reservation exists for the provided identifier.
 *
 * @remarks
 * - Returns a Mongoose document (not lean).
 * - Intended for workflows that may require document mutation.
 */
export const fetchReservationOrThrow = async (
    _id: Types.ObjectId
): Promise<ReservationDocument> => {
    const reservation = await Reservation.findById(_id);

    if (!reservation) {
        throw new BookingError({
            statusCode: 404,
            errorCode: "ERR_RESERVATION_NOT_FOUND",
            message: "Reservation not found."
        });
    }

    return reservation;
};

/**
 * Ensures a reservation has not expired.
 *
 * @param reservation - Reservation fields containing `expiresAt`
 *
 * @throws {@link BookingError}
 * Thrown when the current UTC time is greater than or equal to `expiresAt`.
 *
 * @remarks
 * - Uses UTC-safe date comparison via `calculateDateNow()`.
 * - Intended for checkout and payment workflows.
 */
export const throwOnReservationExpiry = (
    {expiresAt}: ReservationSchemaFields
): void => {
    if (calculateDateNow() >= expiresAt) {
        throw new BookingError({
            statusCode: 409,
            errorCode: "ERR_RESERVATION_EXPIRED",
            message: "Reservation has expired.",
        });
    }
};

/**
 * Ensures the reservation belongs to the provided user.
 *
 * @param params - Object containing:
 * - `userID`: The authenticated user's ObjectId
 * - `reservation`: The reservation to validate
 *
 * @throws {@link BookingError}
 * Thrown when the reservation's `user` does not match `userID`.
 *
 * @remarks
 * - Enforces ownership constraints.
 * - Intended for authorization-sensitive operations (e.g. checkout).
 */
export const throwOnReservationUserMismatch = (
    {userID, reservation: {user: resUser}}: ReservationUserMismatchParams
): void => {
    if (!resUser.equals(userID)) {
        throw new BookingError({
            statusCode: 403,
            errorCode: "ERR_UNAUTHORIZED",
            message: "Unauthorized. Cannot check out reservations not linked to the user.",
        });
    }
};
