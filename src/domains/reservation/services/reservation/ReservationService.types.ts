/**
 * @file ReservationService.types.ts
 *
 * Shared type definitions for ReservationService.
 */

import {Types} from "mongoose";

/**
 * Identifiers required to scope a reservation operation to a specific user.
 */
export type UserReservationIDParams = {
    resID: Types.ObjectId;
    userID: Types.ObjectId;
};
