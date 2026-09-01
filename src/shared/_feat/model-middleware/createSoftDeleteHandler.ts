/**
 * @fileoverview Utility factory for building Mongoose document instance methods that soft-delete records.
 */

import type {HydratedDocument} from "mongoose";
import type {BaseSoftDeleteModel} from "@/shared/_types";

/** Creates a Mongoose document instance method handler to set soft-deletion flags and save the document. */
export function createSoftDeleteHandler<TModel extends BaseSoftDeleteModel>() {
    return async function (this: HydratedDocument<TModel>) {
        this.isDeleted = true;
        this.deletedAt = new Date();

        return this.save();
    };
}