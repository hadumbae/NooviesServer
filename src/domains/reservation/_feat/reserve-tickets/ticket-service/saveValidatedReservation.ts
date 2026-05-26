/**
 * @fileoverview Service for validating and persisting reservation data to the database.
 */

import type {ReservationSchemaFields} from "@domains/reservation/model/reservation/Reservation.types";
import {RequestValidationError} from "@shared/errors/RequestValidationError";
import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import {ReservationPopulateRefs} from "@domains/reservation/constants/ReservationPopulateRefs";
import {type ReserveTicketPersistenceData, ReserveTicketPersistenceSchema} from "@domains/reservation/_feat/reserve-tickets/schemas/persistenceSchema";

/** Validates the input data against the persistence schema before saving and populating the reservation document. */
export const saveValidatedReservation = async (
    data: ReserveTicketPersistenceData
): Promise<ReservationSchemaFields> => {
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
};