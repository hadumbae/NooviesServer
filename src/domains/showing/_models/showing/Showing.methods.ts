/**
 * @fileoverview Defines Mongoose instance methods for the Showing model.
 */

import {ShowingSchema} from "./Showing.schema.js";
import {createSoftDeleteHandler, createSoftDeleteRestoreHandler} from "@/shared/_feat";

/** Performs a soft delete by setting the isDeleted flag and recording the timestamp. */
ShowingSchema.methods.softDelete = createSoftDeleteHandler();

/** Restores a soft-deleted showing by clearing the isDeleted flag and deletion timestamp. */
ShowingSchema.methods.restore = createSoftDeleteRestoreHandler();