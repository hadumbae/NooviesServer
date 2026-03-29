/**
 * @file Type definitions for reservation update service parameters.
 * @filename update-service.types.ts
 */

import {Types} from "mongoose";
import type {ReservationNotesInput} from "@domains/reservation/features/update-reservations/schemas";
import type {DurationLike} from "luxon";

/**
 * Parameters required to execute a reservation notes update operation.
 */
export type UpdateReservationNotesParams = {
    /** The unique Mongoose identifier for the target reservation document. */
    reservationID: Types.ObjectId;

    /** The validated input object containing the updated notes string. */
    data: ReservationNotesInput;
}

/**
 * Parameters required to extend or reset a reservation's expiration TTL.
 */
export type ResetReservationExpiryParams = {
    /** The unique Mongoose identifier for the target reservation document. */
    reservationID: Types.ObjectId;

    /**
     * An object representing the amount of time to add to the current timestamp.
     */
    duration?: DurationLike;
};

/**
 * Parameters required to transition a reservation to a cancelled state.
 */
export type CancelReservationParams = {
    /** The unique Mongoose identifier for the target reservation document. */
    reservationID: Types.ObjectId;

    /** * Optional validated input to override or append to the reservation's notes
     * (e.g., "Customer requested cancellation via phone").
     */
    data?: ReservationNotesInput;
};

/**
 * Parameters required to execute a refund for a reservation.
 */
export type RefundReservationParams = {
    /** The unique Mongoose identifier for the target reservation document. */
    reservationID: Types.ObjectId;

    /** * Optional validated input to document the refund reason or transaction ID
     * within the administrative notes.
     */
    data?: ReservationNotesInput;
};