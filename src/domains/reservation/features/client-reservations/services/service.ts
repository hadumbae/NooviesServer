/**
 * @file Business logic for client-side reservation lifecycle transitions.
 * @filename service.ts
 */

import {BookingError} from "@shared/errors/reservations/BookingError";
import type {CancelClientReservationParams, CheckoutClientReservationParams} from "./service.types";
import type {ShowingSchemaFields} from "@domains/showing/models/showing/Showing.types";
import SeatMap from "@domains/seatmap/model/SeatMap.model";
import {
    assertReservationExists,
    assertReservationNotExpired,
    assertReservationOwnership
} from "domains/reservation/utils/assert";

/**
 * Transitions a reservation from a temporary hold (`RESERVED`) to a finalized `PAID` state.
 * @param params - Identity context and target reservation ID.
 * @returns The updated, saved reservation document.
 * @throws {BookingError} 409 - If the status is not 'RESERVED'.
 */
export const checkoutClientReservation = async (
    {userID, reservationID}: CheckoutClientReservationParams
) => {
    const reservation = await assertReservationExists(reservationID);

    assertReservationOwnership({userID, reservation});
    assertReservationNotExpired(reservation);

    if (reservation.status !== "RESERVED") {
        throw new BookingError({
            statusCode: 409,
            errorCode: "ERR_INVALID_RESERVATION",
            message: "Invalid reservation status.",
        });
    }

    reservation.status = "PAID";
    reservation.isPaid = true;
    reservation.datePaid = new Date();

    await reservation.save();

    return reservation;
};

/**
 * Orchestrates the cancellation of a reservation and release of inventory.
 * @param params - Identity context and target reservation ID.
 * @returns The updated reservation document with `CANCELLED` status.
 */
export const cancelClientReservation = async (
    {userID, reservationID}: CancelClientReservationParams
) => {
    const reservation = await assertReservationExists(reservationID);
    assertReservationOwnership({userID, reservation});

    const {status: resStatus, reservationType: resType, selectedSeating} = reservation;

    if (resStatus === "CANCELLED") return reservation;

    if (resStatus === "RESERVED" || resStatus === "PAID") {
        if (resType === "RESERVED_SEATS") {
            await reservation.populate("showing");
            const populatedShowing = reservation.showing as unknown as ShowingSchemaFields;

            if (populatedShowing.status === "SCHEDULED" || populatedShowing.status === "SOLD_OUT") {
                await SeatMap.updateMany(
                    {_id: {$in: selectedSeating}},
                    {reservation: null, status: "AVAILABLE"}
                );
            }
        }

        reservation.status = "CANCELLED";
        reservation.dateCancelled = new Date();

        await reservation.save();
    }

    return reservation;
}