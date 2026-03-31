import {
    cancelClientReservation,
    checkoutClientReservation
} from "@domains/reservation/features/update-client-reservations/services/service";
import type {
    CancelClientReservationParams,
    CheckoutClientReservationParams
} from "@domains/reservation/features/update-client-reservations/services/service.types";

export {
    checkoutClientReservation,
    cancelClientReservation,
}

export type {
    CheckoutClientReservationParams,
    CancelClientReservationParams,
}

