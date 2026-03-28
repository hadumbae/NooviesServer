/**
 * @file Type definitions for reservation update service parameters.
 * @filename update-service.types.ts
 */

import {Types} from "mongoose";
import type {ReservationNotesInput} from "@domains/reservation/features/update-reservations/schemas";

/**
 * Parameters required to execute a reservation notes update operation.
 */
export type UpdateReservationNotesParams = {
    /** The unique Mongoose identifier for the target reservation document. */
    reservationID: Types.ObjectId;

    /** The validated input object containing the updated notes string. */
    data: ReservationNotesInput;
}