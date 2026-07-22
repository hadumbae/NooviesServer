/**
 * @fileoverview Defines Mongoose instance methods for the Showing model.
 */

import {ShowingSchema} from "./Showing.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ShowingSchemaFields} from "./Showing.types.js";

/** Performs a soft delete by setting the isDeleted flag and recording the timestamp. */
ShowingSchema.methods.softDelete = function (this: HydratedDocument<ShowingSchemaFields>) {
    this.isDeleted = true;
    this.deletedAt = new Date;

    return this.save();
}