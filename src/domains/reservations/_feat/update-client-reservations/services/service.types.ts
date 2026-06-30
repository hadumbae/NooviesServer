/**
 * @fileoverview Parameter types for client reservation service methods.
 */

import {Types} from "mongoose";

/** Parameters required to finalize a pending reservation. */
export type CheckoutClientReservationParams = {
    userID: Types.ObjectId;
    reservationID: Types.ObjectId;
};

/** Identifiers required to securely scope a cancellation request. */
export type CancelClientReservationParams = {
    userID: Types.ObjectId;
    reservationID: Types.ObjectId;
};