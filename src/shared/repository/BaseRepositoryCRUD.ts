/**
 * @file BaseRepositoryCRUD.ts
 * @summary
 * Standard CRUD and pagination contract implemented by all repository layers.
 *
 * @description
 * Defines the minimal data-access interface used by controllers and services:
 * - Basic CRUD operations
 * - Optional filtering, population, and virtual field behavior
 * - Pagination utilities
 *
 * This interface is framework-agnostic and intended to wrap any
 * Mongoose model or equivalent data provider.
 */

import type {
    BaseRepositoryCountParams,
    BaseRepositoryCreateParams,
    BaseRepositoryDestroyParams,
    BaseRepositoryFindByIDParams,
    BaseRepositoryFindParams,
    BaseRepositoryPaginationParams,
    BaseRepositoryUpdateParams,
} from "./BaseRepository.types.js";
import type {ModelObject} from "../types/ModelObject.js";

/**
 * CRUD and pagination contract for repository implementations.
 *
 * @typeParam TSchema - The Mongoose document type handled by the repository.
 */
export default interface BaseRepositoryCRUD<TSchema extends ModelObject> {
    /**
     * Count documents optionally filtered by a query.
     *
     * @param params - Count query filters and options.
     * @returns A promise resolving to the number of matching documents.
     */
    count(params?: BaseRepositoryCountParams<TSchema>): Promise<number>;

    /**
     * Find multiple documents matching optional filters.
     *
     * @param params - Query filters and request options.
     * @returns A promise resolving to a list of documents.
     */
    find(params?: BaseRepositoryFindParams<TSchema>): Promise<TSchema[]>;

    /**
     * Find a single document by its ID.
     *
     * @param params - Document ID and request options.
     * @returns A promise resolving to the found document.
     */
    findById(params: BaseRepositoryFindByIDParams): Promise<TSchema>;

    /**
     * Create a new document.
     *
     * @param params - Payload data and request options.
     * @returns A promise resolving to the created document.
     */
    create(params: BaseRepositoryCreateParams<TSchema>): Promise<TSchema>;

    /**
     * Update an existing document.
     *
     * @param params - Document ID, updated fields, unset fields, and options.
     * @returns A promise resolving to the updated document.
     */
    update(params: BaseRepositoryUpdateParams<TSchema>): Promise<TSchema>;

    /**
     * Delete a document by ID.
     *
     * @param params - Document ID to remove.
     */
    destroy(params: BaseRepositoryDestroyParams): Promise<void>;

    /**
     * Retrieve paginated documents.
     *
     * @param params - Pagination parameters, filters, sorting, and request options.
     * @returns A promise resolving to the documents for the current page.
     */
    paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<TSchema[]>;
}
