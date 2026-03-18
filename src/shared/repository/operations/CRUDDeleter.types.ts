/**
 * @file Shared types for delete (destroy) CRUD operations.
 * @filename CRUDDeleter.types.ts
 */

import {Types} from "mongoose";
import type {BaseModel} from "../../types/schema/BaseModel.js";

/**
 * Parameters required to identify a single document for deletion.
 */
export type CRUDDestroyParams = {
    /** Primary key via {@link Types.ObjectId}. */
    _id: Types.ObjectId;
};

/**
 * Contract for delete-capable repositories or services.
 * * @template TSchema - The model shape extending {@link BaseModel}.
 */
export interface DeleteMethods<TSchema extends BaseModel> {
    /**
     * Permanently deletes a document from the database.
     * * @param params - {@link CRUDDestroyParams}
     */
    destroy(params: CRUDDestroyParams): Promise<void>;

    /**
     * Marks a document as deleted without removing the record.
     * * @param params - {@link CRUDDestroyParams}
     */
    softDelete(params: CRUDDestroyParams): Promise<TSchema>;
}