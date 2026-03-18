/**
 * @file Instance methods for the Showing model.
 * @filename Showing.methods.ts
 */

import {ShowingSchema} from "./Showing.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ShowingSchemaFields} from "./Showing.types.js";

/**
 * Performs a soft-delete by toggling {@link ModelSoftDelete} fields.
 * Validates through {@link ShowingSchema} before persisting.
 */
ShowingSchema.methods.softDelete = function (this: HydratedDocument<ShowingSchemaFields>) {
    this.isDeleted = true;
    this.deletedAt = new Date;

    return this.save();
}