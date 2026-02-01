/**
 * @file ReservationSeatingUtils.ts
 *
 * Seating validation, locking, and finalization utilities used during
 * reservation workflows.
 *
 * Supports:
 * - Capacity-based seating (general admission)
 * - Explicit seat selection with temporary locking (reserved seating)
 *
 * @remarks
 * - Assumes showing and screen context has already been validated upstream
 * - Does not perform payment capture
 * - Seat locks created here are temporary and must be finalized
 *   or released by downstream workflows
 */

import {Types} from "mongoose";
import type {SeatMapSchemaFields} from "../../seatmap/model/SeatMap.types.js";
import SeatMap from "../../seatmap/model/SeatMap.model.js";
import {BookingError} from "../../../shared/errors/reservations/BookingError.js";
import type {CheckSeatsForTicketParams} from "./ReservationSeatingUtils.types.js";
import Seat from "../../seat/model/Seat.model.js";

import {countPaidReservationsByShowing} from "../utilities/countPaidReservationsByShowing.js";
import type {ReservationDoc} from "../model/reservation/Reservation.types.js";
import Reservation from "../model/reservation/Reservation.model.js";

/**
 * Checks whether sufficient seating capacity exists for a
 * ticket-count-based reservation request.
 *
 * Availability is determined by comparing:
 * - Total physical seats on the screen
 * - Seats already consumed by `PAID` reservations
 * - Tickets requested in the current operation
 *
 * @remarks
 * - Intended for general admission or capacity-based seating
 * - Does not lock seats or mutate state
 * - Subject to race conditions if not followed by a locking step
 *
 * @param params - Ticket count and showing/screen context
 * @returns `true` if sufficient capacity exists, otherwise `false`
 */
export async function checkSeatAvailabilityForReservation(
    {ticketCount, showingID, screenID}: CheckSeatsForTicketParams
): Promise<boolean> {
    const seatCount = await Seat
        .find({screen: screenID, layoutType: "SEAT"})
        .countDocuments();

    if (seatCount === 0) {
        return false;
    }

    const resCount = await countPaidReservationsByShowing(showingID);
    return seatCount >= resCount + ticketCount;
}

/**
 * Atomically locks seat-map entries for a reserved-seating reservation
 * and returns their populated seat data.
 *
 * Transitions seat-map documents from:
 * `AVAILABLE` → `PENDING`
 * to prevent concurrent reservation attempts.
 *
 * If any requested seat cannot be locked, all tentative locks are reverted
 * and a booking conflict error is thrown.
 *
 * @remarks
 * - Intended exclusively for reserved-seating workflows
 * - Returned documents represent a temporary lock only
 * - Caller must either finalize or release the lock
 *
 * @param seatIDs - Seat-map ObjectIds to lock
 * @returns Locked seat-map documents with populated seat data
 *
 * @throws BookingError
 * When one or more requested seats are already reserved
 */
export async function fetchAvailableSeatingForReservation(
    seatIDs: Types.ObjectId[]
): Promise<SeatMapSchemaFields[]> {
    const seatMaps = await SeatMap.updateMany(
        {_id: {$in: seatIDs}, status: "AVAILABLE"},
        {status: "PENDING"}
    );

    if (seatMaps.modifiedCount < seatIDs.length) {
        await SeatMap.updateMany(
            {_id: {$in: seatIDs}, status: "PENDING"},
            {status: "AVAILABLE"}
        );

        throw new BookingError({
            statusCode: 409,
            message: "Seat(s) already reserved.",
            errorCode: "ERR_SEAT_RESERVED",
        });
    }

    return SeatMap
        .find({_id: {$in: seatIDs}, status: "PENDING"})
        .populate(["seat"])
        .lean();
}

/**
 * Finalizes seat ownership for a persisted reservation.
 *
 * Transitions locked seat-map entries from:
 * `PENDING` → `RESERVED`
 * and associates them with the reservation.
 *
 * @remarks
 * - No-op for general admission reservations
 * - Must be called only after the reservation has been persisted
 * - On partial failure:
 *   - All seat locks are reverted
 *   - The reservation is marked as `INVALID`
 *   - A booking conflict error is thrown
 *
 * @param reservation - Persisted reservation with locked seating
 *
 * @throws BookingError
 * When one or more locked seats cannot be finalized
 */
export async function reserveSeatsByReservation(
    reservation: ReservationDoc
): Promise<void> {
    const {_id, selectedSeating, reservationType} = reservation;

    if (reservationType === "GENERAL_ADMISSION") {
        return;
    }

    const seatIDs = selectedSeating.map(({_id}) => _id);

    const {modifiedCount} = await SeatMap.updateMany(
        {_id: {$in: seatIDs}, status: "PENDING"},
        {reservation: _id, status: "RESERVED"},
    );

    if (seatIDs.length !== modifiedCount) {
        await SeatMap.updateMany(
            {reservation: _id},
            {reservation: null, status: "AVAILABLE"}
        );

        await Reservation.findByIdAndUpdate(_id, {
            status: "INVALID",
            notes: "Seat(s) already reserved.",
        });

        throw new BookingError({
            statusCode: 409,
            errorCode: "ERR_SEAT_RESERVED",
            message: "Seat(s) already reserved.",
        });
    }
}
