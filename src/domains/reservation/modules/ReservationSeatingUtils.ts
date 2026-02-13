/**
 * @file Seating validation and lifecycle utilities for reservation workflows.
 *
 * Handles:
 * - Capacity checks for general admission
 * - Temporary seat locking and finalization for reserved seating
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
import {fetchReservationOrThrow} from "./ReservationThrowUtils.js";
import type {ShowingSchemaFields} from "../../showing/model/showing/Showing.types.js";

/**
 * Determines if remaining seating capacity can satisfy a ticket request.
 *
 * @remarks
 * Pure availability check. Callers should follow with a locking step
 * to avoid race conditions in concurrent workflows.
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
 * Attempts to acquire a temporary lock on the requested seats.
 *
 * @throws BookingError
 * If any requested seat cannot be locked.
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
 * Commits previously locked seats to the reservation.
 *
 * @remarks
 * On failure, locks are released and the reservation is invalidated.
 *
 * @throws BookingError
 * If locked seats cannot be finalized.
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

/**
 * Releases reserved seating for a cancellable reservation.
 *
 * @remarks
 * No-op for general admission or non-active reservations.
 */
export async function cancelSeatsByReservation(resID: Types.ObjectId): Promise<void> {
    const reservation = await fetchReservationOrThrow(resID);
    const {status, reservationType, selectedSeating} = reservation;

    if (reservationType === "GENERAL_ADMISSION") return;
    if (!(status === "RESERVED" || status === "PAID")) return;

    await reservation.populate("showing");
    const populatedShowing = reservation.showing as unknown as ShowingSchemaFields;

    if (populatedShowing.status === "SCHEDULED" || populatedShowing.status === "SOLD_OUT") {
        await SeatMap.updateMany(
            {_id: {$in: selectedSeating}},
            {reservation: null, status: "AVAILABLE"}
        );
    }
}