/**
 * @file Type definitions for the generic "Find By ID" CRUD operation.
 * @filename crudFindByID.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/features/generic-crud/types";
import {Types} from "mongoose";

/**
 * Specific configuration for the "Find By ID" database operation.
 */
export type FindDocumentByIdConfig<TModel extends BaseModel> = BaseCRUDParams<TModel> & {
    /** The validated Mongoose ObjectId of the document to retrieve. */
    _id: Types.ObjectId;
};