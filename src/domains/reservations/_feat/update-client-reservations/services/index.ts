import {
    cancelClientReservation,
    checkoutClientReservation
} from "@/domains/reservations/_feat/update-client-reservations/services/service";
import type {
    CancelClientReservationParams,
    CheckoutClientReservationParams
} from "@/domains/reservations/_feat/update-client-reservations/services/service.types";

export {
    checkoutClientReservation,
    cancelClientReservation,
}

export type {
    CheckoutClientReservationParams,
    CancelClientReservationParams,
}

