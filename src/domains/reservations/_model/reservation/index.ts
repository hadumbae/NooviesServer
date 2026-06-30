import type {ReservationDoc, ReservationSchemaFields} from "@/domains/reservations/_model/reservation/Reservation.types";
import {type ReservationModel, ReservationSchema} from "@/domains/reservations/_model/reservation/Reservation.schema";
import {Reservation} from "@/domains/reservations/_model/reservation/Reservation.model";

export {
    ReservationSchema,
    Reservation,
}

export type {
    ReservationModel,
    ReservationSchemaFields,
    ReservationDoc,
}