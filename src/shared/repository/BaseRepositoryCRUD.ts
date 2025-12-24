/**
 * @file BaseRepositoryCRUD.ts
 *
 * Base CRUD and pagination contract for repository implementations.
 *
 * Defines the minimal data-access interface consumed by services and controllers.
 * Intended to abstract Mongoose models or equivalent persistence layers.
 */

import type {
    BaseRepositoryCountParams,
    BaseRepositoryCreateParams,
    BaseRepositoryDestroyParams,
    BaseRepositoryFindByIDParams,
    BaseRepositoryFindBySlugParams,
    BaseRepositoryFindParams,
    BaseRepositoryPaginationParams,
    BaseRepositoryUpdateParams,
} from "./BaseRepository.types.js";
import type {ModelObject} from "../types/ModelObject.js";

/**
 * Repository CRUD and pagination interface.
 *
 * @typeParam TSchema - Document shape handled by the repository.
 */
export default interface BaseRepositoryCRUD<TSchema extends ModelObject> {
    /**
     * Count documents matching optional filters.
     *
     * @param params - Filter parameters.
     * @returns Number of matching documents.
     */
    count(params?: BaseRepositoryCountParams<TSchema>): Promise<number>;

    /**
     * Retrieve multiple documents.
     *
     * @param params - Query filters and request options.
     * @returns Matching documents.
     */
    find(params?: BaseRepositoryFindParams<TSchema>): Promise<TSchema[]>;

    /**
     * Retrieve a document by ObjectId.
     *
     * @param params - Document identifier and options.
     * @returns The matching document.
     */
    findById(params: BaseRepositoryFindByIDParams): Promise<TSchema>;

    /**
     * Retrieve a document by slug.
     *
     * @param params - Slug identifier and options.
     * @returns The matching document.
     */
    findBySlug(params: BaseRepositoryFindBySlugParams): Promise<TSchema>;

    /**
     * Create a new document.
     *
     * @param params - Creation payload and options.
     * @returns The created document.
     */
    create(params: BaseRepositoryCreateParams<TSchema>): Promise<TSchema>;

    /**
     * Update an existing document.
     *
     * @param params - Identifier, update data, unset fields, and options.
     * @returns The updated document.
     */
    update(params: BaseRepositoryUpdateParams<TSchema>): Promise<TSchema>;

    /**
     * Delete a document.
     *
     * @param params - Document identifier.
     */
    destroy(params: BaseRepositoryDestroyParams): Promise<void>;

    /**
     * Retrieve documents using pagination.
     *
     * @param params - Pagination, filtering, sorting, and options.
     * @returns Documents for the requested page.
     */
    paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<TSchema[]>;
}
