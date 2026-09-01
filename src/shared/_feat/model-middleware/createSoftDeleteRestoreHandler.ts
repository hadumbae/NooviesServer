/**
 * @fileoverview Utility factory for building Mongoose document instance methods that restore soft-deleted records.
 */

import type {HydratedDocument} from "mongoose";
import type {BaseSoftDeleteModel} from "@/shared/_types";

/** Creates a Mongoose document instance method handler to clear soft-deletion status and save the document. */
export function createSoftDeleteRestoreHandler<TModel extends BaseSoftDeleteModel>() {
    return async function (this: HydratedDocument<TModel>) {
        this.isDeleted = false;
        this.deletedAt = null;

        return this.save();
    }
}