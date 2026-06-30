/**
 * @fileoverview Parameter types for reservation guard and assertion utilities.
 */

import {Types} from "mongoose";
import type {ReservationSchemaFields} from "src/domains/reservations/_model/reservation";

/** Parameters required to validate and assert reservation ownership. */
export type AssertReservationOwnershipConfig = {
    userID: Types.ObjectId;
    reservation: ReservationSchemaFields;
};