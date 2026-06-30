import type {ReservationDoc, ReservationSchemaFields} from "src/domains/reservations/_model/reservation/Reservation.types";
import {type ReservationModel, ReservationSchema} from "src/domains/reservations/_model/reservation/Reservation.schema";
import {Reservation} from "src/domains/reservations/_model/reservation/Reservation.model";

export {
    ReservationSchema,
    Reservation,
}

export type {
    ReservationModel,
    ReservationSchemaFields,
    ReservationDoc,
}