/**
 * @fileoverview Guard utilities and assertions for reservation lifecycle workflows.
 *
 */
import type {ReservationSchemaFields} from "@/domains/reservations/_model/reservation";
import {calculateDateNow} from "@/shared/utility/date/LuxonDateUtils";
import {BookingError} from "@/shared/errors/reservations/BookingError";
import {Types} from "mongoose";
import {Reservation} from "@/domains/reservations/_model/reservation";
import type {AssertReservationOwnershipConfig} from "@/domains/reservations/_feat/assert-reservations/service.types";
import type {DocumentType} from "@/shared/types/mongoose/DocumentType";

/**
 * Retrieves a reservation document or throws a 404 error if not found.
 */
export const assertReservationExists = async (
    _id: Types.ObjectId
): Promise<DocumentType<ReservationSchemaFields>> => {
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
 * Asserts that the reservation hold period has not expired.
 */
export const assertReservationNotExpired = (
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
 * Verifies that the authenticated user is the owner of the specified reservation.
 */
export const assertReservationOwnership = (
    {userID, reservation: {user: resUser}}: AssertReservationOwnershipConfig
): void => {
    /** Mongoose ObjectId comparison using .equals() for reference safety. */
    if (!resUser.equals(userID)) {
        throw new BookingError({
            statusCode: 403,
            errorCode: "ERR_UNAUTHORIZED",
            message: "Unauthorized. Cannot check out reservations not linked to the user.",
        });
    }
};