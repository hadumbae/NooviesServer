/**
 * @fileoverview Service for updating administrative reservation data and managing lifecycle states.
 *
 */

import type {
    CancelReservationParams,
    RefundReservationParams,
    ResetReservationExpiryParams,
    UpdateReservationNotesParams
} from "@/domains/reservations/_feat/update-reservations/service/service.types";
import type {AdminReservation} from "@/domains/reservations/_feat/fetch-customer-reservations";
import createHttpError from "http-errors";
import {Showing} from "@/domains/showing/_models/showing/Showing.model";
import {DateTime} from "luxon";

import {
    fetchAdminReservationByID,
    fetchRequiredAdminReservation
} from "@/domains/reservations/_feat/fetch-customer-reservations/utilities";

/** Updates the administrative notes for a specific reservation. */
export async function updateReservationNotes(
    {reservationID, data}: UpdateReservationNotesParams
): Promise<AdminReservation> {
    const reservation = await fetchAdminReservationByID(reservationID);

    if (!reservation) {
        throw createHttpError(404, "Reservation Not Found!");
    }

    reservation.notes = data.notes ?? null;
    await reservation.save();

    return reservation;
}

/** Extends the expiration timestamp for a pending reservation if it is more than three days before the showing. */
export async function resetReservationExpiry(
    {reservationID, duration = {days: 1}}: ResetReservationExpiryParams
): Promise<AdminReservation> {
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

/** Transitions a reservation to a cancelled state and records the cancellation date. */
export async function cancelReservation(
    {reservationID, data}: CancelReservationParams
): Promise<AdminReservation> {
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

/** Transitions a paid or cancelled reservation to a refunded state. */
export async function refundReservation(
    {reservationID, data}: RefundReservationParams
): Promise<AdminReservation> {
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
