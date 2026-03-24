/**
 * @file Instance methods for the Reservation Mongoose model.
 * @filename Reservation.methods.ts
 */

import ReservationSchema from "./Reservation.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ReservationSchemaFields} from "./Reservation.types.js";

/**
 * Performs a soft-delete on a specific reservation document.
 * @this {HydratedDocument<ReservationSchemaFields>} - The specific reservation instance being deleted.
 * @returns {Promise<HydratedDocument<ReservationSchemaFields>>} The updated and saved document.
 */
ReservationSchema.methods.softDelete = async function (this: HydratedDocument<ReservationSchemaFields>) {
    /** Sets the logical deletion flag to true. */
    this.isDeleted = true;
    /** Captures the current date and time for the deletion record. */
    this.deletedAt = new Date();

    return this.save();
}

/**
 * Restores a soft-deleted reservation document to an active state.
 * @this {HydratedDocument<ReservationSchemaFields>} - The specific reservation instance being restored.
 * @returns {Promise<HydratedDocument<ReservationSchemaFields>>} The restored and saved document.
 */
ReservationSchema.methods.restore = async function (this: HydratedDocument<ReservationSchemaFields>) {
    this.isDeleted = false;
    this.deletedAt = null;

    return this.save();
}