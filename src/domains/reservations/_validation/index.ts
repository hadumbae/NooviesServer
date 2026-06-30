import {
    type ReservationStatus,
    ReservationStatusSchema
} from "src/domains/reservations/_validation/ReservationStatusSchema";
import {
    type ReservationType,
    ReservationTypeSchema
} from "src/domains/reservations/_validation/ReservationTypeSchema";
import {ReservationTypeConstant} from "src/domains/reservations/_validation/ReservationTypeConstant";
import {ReservationStatusConstant} from "src/domains/reservations/_validation/ReservationStatusConstant";

export {
    ReservationStatusSchema,
    ReservationTypeSchema,
    ReservationTypeConstant,
    ReservationStatusConstant,
}

export type {
    ReservationStatus,
    ReservationType,
}
