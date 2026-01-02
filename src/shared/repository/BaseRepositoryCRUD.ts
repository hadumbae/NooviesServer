/**
 * @file BaseRepositoryCRUD.ts
 *
 * Base CRUD and pagination contract for repositories.
 *
 * Defines the minimal persistence-agnostic interface consumed by
 * services and controllers, abstracting the underlying data layer
 * (e.g. Mongoose models).
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
import type { ModelObject } from "../types/ModelObject.js";

/**
 * Repository CRUD and pagination interface.
 *
 * @typeParam TSchema - Persisted document shape.
 * @typeParam TInput  - Input shape for create and update operations.
 */
export default interface BaseRepositoryCRUD<TSchema extends ModelObject, TInput = unknown> extends BaseRepositoryReadMethods<TSchema> {
    /**
     * Create and persist a new document.
     *
     * @param params - Creation payload and options.
     * @returns The created document.
     */
    create(params: BaseRepositoryCreateParams<TInput>): Promise<TSchema>;

    /**
     * Update an existing document.
     *
     * @param params - Identifier, update data, and options.
     * @returns The updated document.
     */
    update(params: BaseRepositoryUpdateParams<TSchema, TInput>): Promise<TSchema>;

    /**
     * Delete a document.
     *
     * @param params - Document identifier.
     */
    destroy(params: BaseRepositoryDestroyParams): Promise<void>;
}

/**
 * Read-only repository operations.
 *
 * @typeParam TSchema - Persisted document shape.
 */
interface BaseRepositoryReadMethods<TSchema extends ModelObject> {
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
     * @param params - Query filters and options.
     * @returns Matching documents.
     */
    find(params?: BaseRepositoryFindParams<TSchema>): Promise<TSchema[]>;

    /**
     * Retrieve a document by ObjectId.
     *
     * @param params - Identifier and options.
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
     * Retrieve documents using pagination.
     *
     * @param params - Pagination, filtering, sorting, and options.
     * @returns Documents for the requested page.
     */
    paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<TSchema[]>;
}
