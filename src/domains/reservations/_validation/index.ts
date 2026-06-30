import {
    type ReservationStatus,
    ReservationStatusSchema
} from "@/domains/reservations/_validation/ReservationStatusSchema";
import {
    type ReservationType,
    ReservationTypeSchema
} from "@/domains/reservations/_validation/ReservationTypeSchema";
import {ReservationTypeConstant} from "@/domains/reservations/_validation/ReservationTypeConstant";
import {ReservationStatusConstant} from "@/domains/reservations/_validation/ReservationStatusConstant";

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
