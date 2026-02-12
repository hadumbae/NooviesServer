/**
 * @file ReservationThrowUtils.types.ts
 *
 * Parameter types for reservation guard utilities.
 */

import { Types } from "mongoose";
import type { ReservationSchemaFields } from "../model/reservation/Reservation.types.js";

/**
 * Parameters required to validate reservation ownership.
 *
 * @property userID - The authenticated user's MongoDB ObjectId
 * @property reservation - Reservation fields containing ownership metadata
 *
 * @remarks
 * Used by `throwOnReservationUserMismatch` to enforce
 * user-to-reservation ownership constraints.
 */
export type ReservationUserMismatchParams = {
    userID: Types.ObjectId;
    reservation: ReservationSchemaFields;
};
