/**
 * @file Strict data access function for retrieving an existing administrative reservation.
 * @filename fetchRequiredAdminReservation.ts
 */

import {Types} from "mongoose";
import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import type {DocumentType} from "@shared/types/mongoose/DocumentType";
import type {AdminReservation} from "@domains/reservation/features/fetch-reservations/admin";
import createHttpError from "http-errors";

/**
 * Retrieves a reservation by ID or throws a 404 error if it does not exist.
 * @param _id - The unique Mongoose {@link Types.ObjectId} of the target reservation.
 * @returns A promise resolving to the populated {@link AdminReservation} document.
 * @throws 404 - "Reservation not found!" if no document matches the provided ID.
 */
export async function fetchRequiredAdminReservation(
    _id: Types.ObjectId
): Promise<DocumentType<AdminReservation>> {
    const reservation = await Reservation
        .findById<DocumentType<AdminReservation>>(_id)
        .populate({path: "user", select: "_id name email"});

    if (!reservation) {
        throw createHttpError(404, "Reservation not found!");
    }

    return reservation;
}