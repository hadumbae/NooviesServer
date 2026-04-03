/**
 * @file Type definitions for the generic "Soft Delete" CRUD operation.
 * @filename crudSoftDelete.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/features/generic-crud/types";
import {Types} from "mongoose";

/**
 * Specific configuration for the soft-delete database operation.
 */
export type SoftDeleteParams<TModel extends BaseModel> = Pick<BaseCRUDParams<TModel>, "model"> & {
    /** The validated Mongoose ObjectId of the document to be soft-deleted. */
    _id: Types.ObjectId;
};