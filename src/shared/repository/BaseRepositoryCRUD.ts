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
 * ⚡ Standard CRUD + pagination contract for repositories.
 * @template TSchema - Mongoose document shape.
 */
export default interface BaseRepositoryCRUD<TSchema extends Record<string, unknown>> {
    /**
     * ⚡ Count documents matching optional filters.
     * @param params - Count query parameters.
     * @returns Number of matching documents.
     */
    count(params?: BaseRepositoryCountParams<TSchema>): Promise<number>;

    /**
     * ⚡ Find documents matching optional filters.
     * @param params - Query filters + request options.
     * @returns List of documents.
     */
    find(params?: BaseRepositoryFindParams<TSchema>): Promise<TSchema[]>;

    /**
     * ⚡ Find a single document by ID.
     * @param params - Document ID + request options.
     * @returns The found document.
     */
    findById(params: BaseRepositoryFindByIDParams): Promise<TSchema>;

    /**
     * ⚡ Create a new document.
     * @param params - Creation data + request options.
     * @returns The created document.
     */
    create(params: BaseRepositoryCreateParams<TSchema>): Promise<TSchema>;

    /**
     * ⚡ Update a document by ID.
     * @param params - ID, update fields, unset fields, request options.
     * @returns The updated document.
     */
    update(params: BaseRepositoryUpdateParams<TSchema>): Promise<TSchema>;

    /**
     * ⚡ Delete a document by ID.
     * @param params - ID of the document to delete.
     */
    destroy(params: BaseRepositoryDestroyParams): Promise<void>;

    /**
     * ⚡ Retrieve paginated documents.
     * @param params - Pagination filters, sorting, request options.
     * @returns Documents for the requested page.
     */
    paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<TSchema[]>;
}
