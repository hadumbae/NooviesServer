/**
 * @file Parameter types for reservation guard and assertion utilities.
 * @filename assertUtils.types.ts
 */

import { Types } from "mongoose";
import type { ReservationSchemaFields } from "../../model/reservation/Reservation.types";

/**
 * Parameters required to validate and assert reservation ownership.
 * ---
 * ### Mechanics
 * Bundles the active security context (`userID`) with the target
 * data model (`reservation`) to perform safe equality checks.
 * ---
 */
export type AssertReservationOwnershipParams = {
    /** The MongoDB ObjectId of the authenticated user from the request context. */
    userID: Types.ObjectId;

    /** * The hydrated reservation document or schema fields.
     * Specifically requires the `user` field to perform the ownership comparison.
     */
    reservation: ReservationSchemaFields;
};