/**
 * @fileoverview Utility factory for building Mongoose query middleware that automatically filters out soft-deleted records.
 */

import type {Query} from "mongoose";
import type {BaseSoftDeleteModel} from "@/shared/_types";

/** Creates a Mongoose query middleware handler that enforces soft-delete filtering unless explicitly overridden. */
export function createSoftDeleteMiddleware<TModel extends BaseSoftDeleteModel>() {
    return async function (this: Query<any, TModel>) {
        if (this.getOptions().getSoftDeleted) {
            return;
        }

        this.where({isDeleted: false, deletedAt: null});
    }
}