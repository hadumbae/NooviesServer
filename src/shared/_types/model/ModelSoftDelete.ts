/**
 * @fileoverview Defines types and methods for implementing soft delete functionality in models.
 */

import type {BaseModel} from "@/shared/_types/model/BaseModel.js";

/** Represents the state of a soft-deleted record. */
export type ModelSoftDelete = {
    isDeleted: boolean;
    deletedAt: Date | null;
}

/** Methods required for a model to support soft deletion. */
export type ModelSoftDeleteMethods<TModel extends BaseModel = BaseModel> = {
    softDelete: () => Promise<BaseModel>;
}