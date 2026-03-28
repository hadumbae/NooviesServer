/**
 * @file Business logic for updating administrative reservation data.
 * @filename update-service.ts
 */

import type {
    UpdateReservationNotesParams
} from "@domains/reservation/features/update-reservations/service/service.types";
import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import type {AdminReservation} from "@domains/reservation/features/fetch-reservations/admin";
import createHttpError from "http-errors";
import type {DocumentType} from "@shared/types/mongoose/DocumentType";

/**
 * Updates the administrative notes for a specific reservation.
 * @param params - Object containing the target `reservationID` and the new `notes` data.
 * @returns The updated {@link AdminReservation} document with populated user details.
 */
export const updateReservationNotes = async (
    {reservationID, data}: UpdateReservationNotesParams
): Promise<AdminReservation> => {
    const reservation = await Reservation
        .findById<DocumentType<AdminReservation>>(reservationID)
        .populate({path: "user", select: "_id name email"});

    if (!reservation) {
        throw createHttpError(404, "Reservation Not Found!");
    }

    reservation.notes = data.notes ?? null;
    await reservation.save();

    return reservation;
}