/**
 * @fileoverview Service for validating and persisting reservation data to the database.
 */

import {RequestValidationError} from "@/shared/errors/RequestValidationError";
import {ReservationPopulatePaths} from "@/domains/reservations/_feat/query-population/ReservationPopulatePaths";
import {
    type ReserveTicketPersistenceData,
    ReserveTicketPersistenceSchema
} from "@/domains/reservations/_feat/reserve-tickets";
import {Reservation, type ReservationSchemaFields} from "@/domains/reservations/_model/reservation";

/** Validates the input data against the persistence schema before saving and populating the reservation document. */
export async function saveValidatedReservation(
    data: ReserveTicketPersistenceData
): Promise<ReservationSchemaFields> {
    const {data: parsedData, success, error} = ReserveTicketPersistenceSchema.safeParse(data);

    if (!success) {
        throw new RequestValidationError({
            message: "Failed to parse ticket checkout input data.",
            errors: error?.errors,
            raw: data,
        });
    }

    const doc = new Reservation(parsedData);
    await doc.save();

    await doc.populate(ReservationPopulatePaths);

    return doc;
}