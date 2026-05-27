/**
 * @fileoverview Type definitions for reservation update service parameters.
 */

import {Types} from "mongoose";
import type {ReservationNotesInput} from "@domains/reservation/_feat/update-reservations/schemas";
import type {DurationLike} from "luxon";

/** Parameters required to execute a reservation notes update operation. */
export type UpdateReservationNotesParams = {
    reservationID: Types.ObjectId;
    data: ReservationNotesInput;
}

/** Parameters required to extend or reset a reservation's expiration TTL. */
export type ResetReservationExpiryParams = {
    reservationID: Types.ObjectId;
    duration?: DurationLike;
};

/** Parameters required to transition a reservation to a cancelled state. */
export type CancelReservationParams = {
    reservationID: Types.ObjectId;
    data?: ReservationNotesInput;
};

/** Parameters required to execute a refund for a reservation. */
export type RefundReservationParams = {
    reservationID: Types.ObjectId;
    data?: ReservationNotesInput;
};