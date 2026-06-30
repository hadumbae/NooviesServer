/**
 * @fileoverview Data access utility for retrieving administrative reservation documents.
 */

import {Types} from "mongoose";
import type {DocumentType} from "@/shared/types/mongoose/DocumentType";
import type {AdminReservation} from "src/domains/reservations/_feat/fetch-customer-reservations";
import createHttpError from "http-errors";
import {Reservation} from "src/domains/reservations/_model/reservation";

/**
 * Retrieves a populated reservation by ID or throws a 404 error if it does not exist.
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