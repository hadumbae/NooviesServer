/**
 * @file Type definitions for the generic "Find" CRUD operation.
 * @filename crudFind.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/features/generic-crud/types";
import type {FilterQuery} from "mongoose";

/**
 * Specific configuration for the "Find" database operation.
 * ---
 * ### Mechanics
 * * **Data Intersection:** Merges standard CRUD parameters with Mongoose-specific
 * filtering capabilities to enable complex query construction.
 * ---
 */
export type FindDocumentsParams<TModel extends BaseModel> = BaseCRUDParams<TModel> & {
    /** Optional Mongoose filter criteria to restrict the result set. */
    filters?: FilterQuery<TModel>;
};