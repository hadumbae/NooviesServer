/**
 * @fileoverview Data access function for retrieving a single administrative reservation record.
 */

import type {DocumentType} from "@/shared/_types/mongoose/DocumentType";
import type {AdminReservation} from "@/domains/reservations/_feat/fetch-customer-reservations";
import {Types} from "mongoose";
import {Reservation} from "@/domains/reservations/_model/reservation";

/** Retrieves a reservation by its unique identifier with administrative-level detail. */
export function fetchAdminReservationByID(
    _id: Types.ObjectId
): Promise<DocumentType<AdminReservation> | null> {
    return Reservation
        .findById<DocumentType<AdminReservation>>(_id)
        .populate({path: "user", select: "_id name email"});
}