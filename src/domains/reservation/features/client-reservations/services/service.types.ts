/**
 * @file Parameter types for client reservation service methods.
 * @filename service.types.ts
 */

import {Types} from "mongoose";

/**
 * Parameters required to finalize a pending reservation.
 */
export type CheckoutClientReservationParams = {
    /** The authenticated user's ID to verify ownership. */
    userID: Types.ObjectId;
    /** The specific reservation to be paid for. */
    reservationID: Types.ObjectId;
};

/**
 * Identifiers required to securely scope a cancellation request.
 */
export type CancelClientReservationParams = {
    /** The authenticated user's ID to verify ownership. */
    userID: Types.ObjectId;
    /** The specific reservation to be voided. */
    reservationID: Types.ObjectId;
};