/**
 * @file Business logic for updating administrative reservation data and lifecycle states.
 * @filename update-service.ts
 */

import type {
    CancelReservationParams, RefundReservationParams,
    ResetReservationExpiryParams,
    UpdateReservationNotesParams
} from "@domains/reservation/features/update-reservations/service/service.types";
import type {AdminReservation} from "@domains/reservation/features/fetch-reservations/admin";
import createHttpError from "http-errors";
import Showing from "@domains/showing/models/showing/Showing.model";
import {DateTime} from "luxon";

import {
    fetchAdminReservationByID,
    fetchRequiredAdminReservation
} from "@domains/reservation/features/fetch-reservations/admin/utilities";

/**
 * Updates the administrative notes for a specific reservation.
 * @param params - Object containing the target `reservationID` and the new `notes` data.
 * @returns The updated {@link AdminReservation} document with populated user details.
 * @throws 404 if the reservation ID is invalid or not found.
 */
export const updateReservationNotes = async (
    {reservationID, data}: UpdateReservationNotesParams
): Promise<AdminReservation> => {
    const reservation = await fetchAdminReservationByID(reservationID);

    if (!reservation) {
        throw createHttpError(404, "Reservation Not Found!");
    }

    reservation.notes = data.notes ?? null;
    await reservation.save();

    return reservation;
}

/**
 * Extends the TTL (Time-To-Live) for a pending reservation.
 * @param params - Object containing `reservationID` and an optional Luxon `Duration` object.
 * @returns The updated reservation document with the new expiration timestamp.
 * @throws 404 if reservation/showing is missing.
 * @throws 409 if status is not 'RESERVED'.
 * @throws 422 if the requested extension violates the 3-day buffer rule.
 */
export const resetReservationExpiry = async (
    {reservationID, duration = {days: 1}}: ResetReservationExpiryParams
) => {
    const reservation = await fetchAdminReservationByID(reservationID);
    if (!reservation) throw createHttpError(404, "Reservation not found.");

    if (reservation.status !== "RESERVED") {
        throw createHttpError(409, "Invalid status, must be 'RESERVED'.");
    }

    const showing = await Showing.findById(reservation.showing).select("startTime").lean();
    if (!showing) throw createHttpError(404, "Reservation's showing does not exist.");

    const {startTime} = showing;

    const updatedExpiresAt = DateTime.now().toUTC().plus(duration);
    const showingCheck = DateTime.fromJSDate(startTime).toUTC().minus({days: 3});

    if (updatedExpiresAt >= showingCheck) {
        throw createHttpError(422, "Cannot reset expiry to within three days from showing.");
    }

    reservation.status = "RESERVED";
    reservation.expiresAt = updatedExpiresAt.toJSDate();

    await reservation.save();

    return reservation;
}

/**
 * Transition a reservation to a cancelled state.
 * @param params - Object containing `reservationID` and optional cancellation data/notes.
 * @returns The updated reservation document with the `CANCELLED` status.
 * @throws 404 if the reservation is not found.
 * @throws 409 if the reservation is in an un-cancellable state (e.g., already CANCELLED or COMPLETED).
 */
export const cancelReservation = async (
    {reservationID, data}: CancelReservationParams
) => {
    const reservation = await fetchAdminReservationByID(reservationID);
    if (!reservation) throw createHttpError(404, "Reservation not found.");

    if (reservation.status !== "RESERVED" && reservation.status !== "PAID") {
        throw createHttpError(409, "Invalid status, must be 'RESERVED' or 'PAID'.");
    }

    reservation.status = "CANCELLED";
    reservation.dateCancelled = new Date();
    reservation.notes = data?.notes ?? reservation.notes ?? null;

    await reservation.save();

    return reservation;
}

/**
 * Transitions a reservation to a `REFUNDED` state.
 * @param params - Object containing the target `reservationID` and optional refund notes.
 * @returns The updated reservation document with the `REFUNDED` status.
 * @throws 409 - If the reservation was never paid or is not in a valid state for refunding.
 */
export const refundReservation = async (
    {reservationID, data}: RefundReservationParams
) => {
    const reservation = await fetchRequiredAdminReservation(reservationID);

    if (!reservation.isPaid) {
        throw createHttpError(409, "Invalid status, must be a paid reservation.");
    }

    if (reservation.status !== "PAID" && reservation.status !== "CANCELLED") {
        throw createHttpError(409, "Invalid status, must be 'PAID' or 'CANCELLED'.");
    }

    if (reservation.status === "PAID") {
        reservation.dateCancelled = new Date();
    }

    reservation.status = "REFUNDED";
    reservation.dateRefunded = new Date();
    reservation.notes = data?.notes ?? reservation.notes ?? null;

    await reservation.save();

    return reservation;
}
