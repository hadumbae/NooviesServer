/**
 * @file Data access function for retrieving a single administrative reservation record.
 * @filename fetchAdminReservationByID.ts
 */

import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import type {DocumentType} from "@shared/types/mongoose/DocumentType";
import type {AdminReservation} from "@domains/reservation/features/fetch-reservations/admin";
import {Types} from "mongoose";

/**
 * Retrieves a reservation by its unique identifier with administrative-level detail.
 * ---
 * ### Data Enrichment
 * * **Population:** Automatically joins the `user` document to include the owner's
 * primary identity fields (`_id`, `name`, `email`).
 * * **Typing:** Returns a Mongoose {@link DocumentType} wrapping the {@link AdminReservation}
 * interface, providing access to both the data and Mongoose document methods (like `.save()`).
 * ---
 * ### Usage
 * Typically used in administrative "View Details" pages or as a precursor to
 * update operations where user context is required for notifications or logging.
 * * @param _id - The Mongoose {@link Types.ObjectId} of the reservation to fetch.
 * @returns A promise resolving to the populated document or `null` if no record exists.
 */
export function fetchAdminReservationByID(
    _id: Types.ObjectId
): Promise<DocumentType<AdminReservation> | null> {
    return Reservation
        .findById<DocumentType<AdminReservation>>(_id)
        .populate({path: "user", select: "_id name email"});
}