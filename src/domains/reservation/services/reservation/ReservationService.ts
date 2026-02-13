/**
 * @file Reservation cancellation service operations.
 */

import type {UserReservationIDParams} from "./ReservationService.types.js";
import {fetchReservationOrThrow, throwOnReservationUserMismatch} from "../../modules/ReservationThrowUtils.js";
import {cancelSeatsByReservation} from "../../modules/ReservationSeatingUtils.js";

/**
 * Cancels a reservation owned by the requesting user.
 *
 * @remarks
 * Reserved seating is released prior to cancellation when applicable.
 */
export const cancelReservation = async (
    {resID, userID}: UserReservationIDParams
) => {
    const reservation = await fetchReservationOrThrow(resID);
    throwOnReservationUserMismatch({userID, reservation});
    const {status: resStatus, reservationType: resType} = reservation;

    if (resStatus === "CANCELLED") return reservation;
    if (resStatus === "RESERVED" || resStatus === "PAID") {
        if (resType === "RESERVED_SEATS") {
            await cancelSeatsByReservation(resID);
        }

        reservation.status = "CANCELLED";
        reservation.dateCancelled = new Date();

        await reservation.save();
    }

    return reservation;
}
