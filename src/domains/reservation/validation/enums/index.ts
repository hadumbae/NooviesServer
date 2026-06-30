import {
    type ReservationStatus,
    ReservationStatusSchema
} from "@/domains/reservation/validation/enums/ReservationStatusSchema";
import {
    type ReservationType,
    ReservationTypeSchema
} from "@/domains/reservation/validation/enums/ReservationTypeSchema";
import {ReservationTypeConstant} from "@/domains/reservation/validation/enums/ReservationTypeConstant";
import {ReservationStatusConstant} from "@/domains/reservation/validation/enums/ReservationStatusConstant";

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
