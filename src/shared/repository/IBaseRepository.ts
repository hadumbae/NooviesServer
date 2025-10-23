import type {
    BaseRepositoryCountParams,
    BaseRepositoryCreateParams,
    BaseRepositoryDestroyParams,
    BaseRepositoryFindByIDParams,
    BaseRepositoryFindParams,
    BaseRepositoryPaginationParams,
    BaseRepositoryUpdateParams
} from "./BaseRepository.types.js";

/**
 * Generic interface for a base repository.
 *
 * Defines standard CRUD and pagination methods that a repository
 * class should implement for a Mongoose model.
 *
 * @template TSchema - Type of the Mongoose document managed by the repository.
 */
export default interface IBaseRepository<TSchema extends Record<string, any>> {
    /**
     * Counts documents matching the provided filters.
     *
     * @param params - Optional filters for the count query.
     * @returns The number of documents matching the filters.
     */
    count(params?: BaseRepositoryCountParams<TSchema>): Promise<number>;

    /**
     * Finds documents matching the provided filters.
     *
     * @param params - Optional query parameters including filters, population, and limits.
     * @returns Array of documents matching the query.
     */
    find(params?: BaseRepositoryFindParams<TSchema>): Promise<any>;

    /**
     * Finds a document by its ID.
     *
     * @param params - Parameters including `_id` and optional population or virtual options.
     * @returns The document if found.
     */
    findById(params: BaseRepositoryFindByIDParams): Promise<any>;

    /**
     * Creates a new document.
     *
     * @param params - Parameters including document data, population, and virtual options.
     * @returns The newly created document.
     */
    create(params: BaseRepositoryCreateParams<TSchema>): Promise<any>;

    /**
     * Updates an existing document by ID.
     *
     * @param params - Parameters including `_id`, fields to update, fields to unset,
     *                 and optional population/virtual options.
     * @returns The updated document.
     */
    update(params: BaseRepositoryUpdateParams<TSchema>): Promise<any>;

    /**
     * Deletes a document by its ID.
     *
     * @param params - Parameters including `_id` of the document to delete.
     * @returns A promise resolving when deletion is complete.
     */
    destroy(params: BaseRepositoryDestroyParams): Promise<any>;

    /**
     * Retrieves documents in a paginated format.
     *
     * @param params - Pagination parameters including page, perPage, filters, sort, and population options.
     * @returns Array of documents for the requested page.
     */
    paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<any>;
}
