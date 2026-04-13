/**
 * @file Type definitions for the generic "Delete" CRUD operation.
 * @filename crudDelete.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/_feat/generic-crud/types";
import {Types} from "mongoose";

/**
 * Specific configuration for the document deletion operation.
 */
export type DeleteDocumentConfig<TModel extends BaseModel> = Pick<BaseCRUDParams<TModel>, "model"> & {
    /** The validated Mongoose ObjectId of the document to be permanently removed. */
    _id: Types.ObjectId;
};