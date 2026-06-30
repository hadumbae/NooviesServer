/**
 * @fileoverview Defines Mongoose instance methods for the Reservation model.
 */

import {ReservationSchema} from "./Reservation.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ReservationSchemaFields} from "./Reservation.types.js";

/** Performs a soft delete by setting the isDeleted flag and recording the timestamp. */
ReservationSchema.methods.softDelete = async function (this: HydratedDocument<ReservationSchemaFields>) {
    this.isDeleted = true;
    this.deletedAt = new Date();

    return this.save();
}

/** Restores a soft-deleted reservation by clearing the deletion flag and timestamp. */
ReservationSchema.methods.restore = async function (this: HydratedDocument<ReservationSchemaFields>) {
    this.isDeleted = false;
    this.deletedAt = null;

    return this.save();
}