/**
 * @fileoverview Defines Mongoose instance methods for the Reservation model.
 */

import {ReservationSchema} from "./Reservation.schema.js";
import {createSoftDeleteHandler, createSoftDeleteRestoreHandler} from "@/shared/_feat";

/** Performs a soft delete by setting the isDeleted flag and recording the timestamp. */
ReservationSchema.methods.softDelete = createSoftDeleteHandler();

/** Restores a soft-deleted reservation by clearing the deletion flag and timestamp. */
ReservationSchema.methods.restore = createSoftDeleteRestoreHandler()