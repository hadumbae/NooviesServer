import type {SeatMapSchemaFields} from "../model/SeatMap.types.js";
import {Types} from "mongoose";
import SeatMap from "../model/SeatMap.model.js";
import {BookingError} from "../../../shared/errors/reservations/BookingError.js";

/**
 * Atomically locks seats for reservation and returns their populated data.
 *
 * Attempts to transition the specified seat-map entries from
 * `AVAILABLE` → `PENDING` to prevent concurrent reservations.
 *
 * If any seat cannot be locked (i.e. is no longer available),
 * all tentative locks are reverted and a booking conflict error
 * is thrown.
 *
 * @remarks
 * - Intended for reservation initiation workflows
 * - Showing context is assumed to be validated elsewhere
 * - Returned documents are read-only and should be treated
 *   as a temporary reservation lock
 *
 * @param seatIDs - Seat map ObjectIds to lock for reservation
 * @returns Array of seat-map documents with populated seat data
 * @throws BookingError When one or more seats are already reserved
 */
export async function fetchSeatingForReservation(
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
