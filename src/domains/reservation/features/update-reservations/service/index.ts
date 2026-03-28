import type {
    ResetReservationExpiryParams,
    UpdateReservationNotesParams
} from "@domains/reservation/features/update-reservations/service/service.types";
import {
    resetReservationExpiry,
    updateReservationNotes
} from "@domains/reservation/features/update-reservations/service/service";

export {
    updateReservationNotes,
    resetReservationExpiry,
}

export type {
    UpdateReservationNotesParams,
    ResetReservationExpiryParams,
}