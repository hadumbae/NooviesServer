import {Types} from "mongoose";

/**
 * @file CRUDDeleter.types.ts
 *
 * Shared types for delete (destroy) CRUD operations.
 */

/**
 * Parameters required to delete a single document.
 */
export type CRUDDestroyParams = {
    /** MongoDB ObjectId of the target document */
    _id: Types.ObjectId;
};

/**
 * Contract for delete-capable repositories or services.
 */
export interface DeleteMethods {
    /**
     * Permanently deletes a document.
     *
     * @param params - Deletion parameters
     */
    destroy(params: CRUDDestroyParams): Promise<void>;
}
