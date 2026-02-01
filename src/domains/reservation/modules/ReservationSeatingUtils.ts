/**
 * @file ReservationSeatingUtils.ts
 *
 * Utilities for validating and securing seating availability during
 * reservation workflows.
 *
 * Covers both:
 * - Reserved seating (explicit seat selection with temporary locks)
 * - Capacity-based seating (ticket-count validation without seat locking)
 *
 * All functions assume showing and screen context has been validated
 * by higher-level reservation orchestration.
 */

import {Types} from "mongoose";
import type {SeatMapSchemaFields} from "../../seatmap/model/SeatMap.types.js";
import SeatMap from "../../seatmap/model/SeatMap.model.js";
import {BookingError} from "../../../shared/errors/reservations/BookingError.js";
import type {CheckSeatsForTicketParams} from "./ReservationSeatingUtils.types.js";
import Seat from "../../seat/model/Seat.model.js";

import {countPaidReservationsByShowing} from "../utilities/countPaidReservationsByShowing.js";

/**
 * Atomically locks seat-map entries for a reserved-seating reservation
 * and returns their populated seat data.
 *
 * Transitions the specified seat-map documents from:
 * `AVAILABLE` → `PENDING`
 * to prevent concurrent reservation attempts.
 *
 * If any requested seat cannot be locked, all tentative locks are reverted
 * and a booking conflict error is thrown.
 *
 * @remarks
 * - Intended exclusively for reserved-seating flows
 * - Showing and screen validation is assumed to occur upstream
 * - Returned documents represent a temporary reservation lock
 * - Caller is responsible for completing or releasing the lock
 *
 * @param seatIDs - Seat-map ObjectIds to lock
 * @returns Locked seat-map documents with populated seat data
 * @throws BookingError When one or more seats are already reserved
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
 * Checks whether sufficient seating capacity exists for a
 * ticket-based (non-reserved) reservation request.
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
