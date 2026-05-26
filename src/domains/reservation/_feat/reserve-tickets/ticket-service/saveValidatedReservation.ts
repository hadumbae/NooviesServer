/**
 * @fileoverview Service for validating and persisting reservation data to the database.
 */

import {RequestValidationError} from "@shared/errors/RequestValidationError";
import {ReservationPopulateRefs} from "@domains/reservation/constants/ReservationPopulateRefs";
import {
    type ReserveTicketPersistenceData,
    ReserveTicketPersistenceSchema
} from "@domains/reservation/_feat/reserve-tickets";
import {Reservation, type ReservationSchemaFields} from "@domains/reservation/model/reservation";

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

    await doc.populate(ReservationPopulateRefs);

    return doc;
}