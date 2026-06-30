import type {ReservationDoc, ReservationSchemaFields} from "@/domains/reservation/model/reservation/Reservation.types";
import {type ReservationModel, ReservationSchema} from "@/domains/reservation/model/reservation/Reservation.schema";
import {Reservation} from "@/domains/reservation/model/reservation/Reservation.model";

export {
    ReservationSchema,
    Reservation,
}

export type {
    ReservationModel,
    ReservationSchemaFields,
    ReservationDoc,
}