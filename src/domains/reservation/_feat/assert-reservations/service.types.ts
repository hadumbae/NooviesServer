/**
 * @fileoverview Parameter types for reservation guard and assertion utilities.
 */

import {Types} from "mongoose";
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation";

/** Parameters required to validate and assert reservation ownership. */
export type AssertReservationOwnershipConfig = {
    userID: Types.ObjectId;
    reservation: ReservationSchemaFields;
};