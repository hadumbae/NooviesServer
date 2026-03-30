/**
 * @file Guard utilities and assertions for reservation lifecycle workflows.
 * @filename assertUtils.ts
 */

import type {ReservationSchemaFields} from "../../model/reservation/Reservation.types";
import {calculateDateNow} from "@shared/utility/date/LuxonDateUtils";
import {BookingError} from "@shared/errors/reservations/BookingError";
import {Types} from "mongoose";
import Reservation from "../../model/reservation/Reservation.model";
import type {ReservationDocument} from "../../types/ReservationTypes";
import type {AssertReservationOwnershipParams} from "./assertUtils.types";

/**
 * Retrieves a reservation document or terminates the request with a 404 error.
 * @param _id - The unique MongoDB ObjectId of the reservation.
 * @returns A promise resolving to the hydrated {@link ReservationDocument}.
 * @throws {BookingError} 404 - If the identifier does not match any record.
 */
export const assertReservationExists = async (
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
 * Validates that the reservation hold period has not lapsed.
 * @param reservation - The reservation fields containing the `expiresAt` timestamp.
 * @throws {BookingError} 409 - If the current time is equal to or past the expiration deadline.
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
 * Asserts that the authenticated user is the legal owner of the reservation.
 * @param params - Contains the `userID` to check and the `reservation` object to verify.
 * @throws {BookingError} 403 - If the IDs do not match, indicating an unauthorized access attempt.
 */
export const assertReservationOwnership = (
    {userID, reservation: {user: resUser}}: AssertReservationOwnershipParams
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