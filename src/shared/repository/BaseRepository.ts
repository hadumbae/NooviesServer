import { Error, type Model } from "mongoose";
import createHttpError from "http-errors";
import type { PopulatePath } from "../types/PopulatePath.js";
import type IBaseRepository from "../interfaces/IBaseRepository.js";
import type {
    BaseRepositoryCountParams,
    BaseRepositoryCreateParams,
    BaseRepositoryDestroyParams,
    BaseRepositoryFindByIDParams,
    BaseRepositoryFindParams,
    BaseRepositoryPaginationParams,
    BaseRepositoryUpdateParams
} from "../types/BaseRepositoryTypes.js";

/**
 * Constructor options for {@link BaseRepository}.
 *
 * @template TSchema - Mongoose schema type for the repository.
 */
interface IBaseRepositoryConstructor<TSchema> {
    /** Mongoose model for the repository. */
    model: Model<TSchema>;
    /** Optional default paths to populate for queries. */
    populateRefs?: PopulatePath[];
}

/**
 * Generic base repository providing common CRUD and pagination methods
 * for Mongoose models.
 *
 * Handles standard database operations and error handling,
 * including duplicate key errors, fetch errors, and persistence errors.
 *
 * @template TSchema - Type of Mongoose document managed by the repository.
 */
export default class BaseRepository<TSchema extends Record<string, any>> implements IBaseRepository<TSchema> {
    private readonly model: Model<TSchema>;
    private readonly populateRefs: PopulatePath[];

    /**
     * Creates a new BaseRepository instance.
     *
     * @param options.model - The Mongoose model to manage.
     * @param options.populateRefs - Optional default paths to populate in queries.
     */
    constructor({ model, populateRefs = [] }: IBaseRepositoryConstructor<TSchema>) {
        this.model = model;
        this.populateRefs = populateRefs;
    }

    /**
     * Counts documents matching the provided filters.
     *
     * @param params.filters - Optional filters to apply.
     * @returns The number of documents matching the filters.
     */
    async count(params?: BaseRepositoryCountParams<TSchema>): Promise<number> {
        const { filters = {} } = params || {};
        return this.model.countDocuments(filters);
    }

    /**
     * Finds documents matching the provided filters.
     *
     * @param params.filters - Optional filters to apply.
     * @param params.populate - Whether to populate referenced paths.
     * @param params.virtuals - Whether to include virtuals in lean queries.
     * @param params.populatePath - Specific paths to populate instead of default.
     * @param params.limit - Optional maximum number of results.
     * @returns Array of documents matching the query.
     */
    async find(params?: BaseRepositoryFindParams<TSchema>): Promise<any> {
        const { populate = false, virtuals = false, filters = {}, populatePath, limit } = params || {};
        const query = this.model.find(filters);

        if (typeof limit === "number") query.limit(limit);
        if (populate) query.populate(populatePath || this.populateRefs);
        if (virtuals) query.lean({ virtuals: true });

        return query;
    }

    /**
     * Finds a document by its ID.
     *
     * @param _id - The document ID.
     * @param populate - Whether to populate referenced paths.
     * @param populatePath - Specific paths to populate.
     * @param virtuals - Whether to include virtuals in lean queries.
     * @returns The document if found.
     * @throws {HttpError} 404 if document is not found.
     */
    async findById({ _id, populatePath, populate, virtuals = false }: BaseRepositoryFindByIDParams): Promise<any> {
        try {
            const query = this.model.findById(_id);
            if (populate) query.populate(populatePath || this.populateRefs);
            if (virtuals) query.lean({ virtuals: true });
            return query;
        } catch (error: unknown) {
            this.throwFetchError(error);
        }
    }

    /**
     * Creates a new document.
     *
     * @param params.data - The document data to create.
     * @param params.populate - Whether to populate referenced paths after creation.
     * @param params.populatePath - Specific paths to populate.
     * @param params.virtuals - Whether to include virtuals in lean queries.
     * @returns The created document.
     * @throws {ZodParseError|HttpError} On duplicate key or persistence error.
     */
    async create(params: BaseRepositoryCreateParams<TSchema>): Promise<any> {
        const { data, populatePath, populate, virtuals = false } = params;
        try {
            const doc = new this.model(data);
            await doc.save();
            if (populate) await doc.populate(populatePath || this.populateRefs);
            if (virtuals) await doc.lean({ virtuals });
            return doc;
        } catch (error: unknown) {
            this.throwPersistError(error);
        }
    }

    /**
     * Updates an existing document by ID.
     *
     * @param params._id - The ID of the document to update.
     * @param params.data - Fields to update.
     * @param params.unset - Fields to unset.
     * @param params.populate - Whether to populate referenced paths after update.
     * @param params.populatePath - Specific paths to populate.
     * @param params.virtuals - Whether to include virtuals in lean queries.
     * @returns The updated document.
     * @throws {ZodParseError|HttpError} On duplicate key, persistence, or not found error.
     */
    async update(params: BaseRepositoryUpdateParams<TSchema>): Promise<any> {
        const { _id, data, unset, populatePath, populate, virtuals = false } = params;
        const updateObject: Record<string, any> = { $set: data };
        if (unset) updateObject.$unset = unset;

        try {
            const query = this.model.findByIdAndUpdate(_id, updateObject, { new: true });
            if (populate) query.populate(populatePath || this.populateRefs);
            if (virtuals) query.lean({ virtuals });
            return await query.orFail();
        } catch (error: unknown) {
            this.throwPersistError(error);
        }
    }

    /**
     * Deletes a document by its ID.
     *
     * @param _id - The ID of the document to delete.
     * @throws {HttpError} 404 if document is not found.
     */
    async destroy({ _id }: BaseRepositoryDestroyParams): Promise<any> {
        const doc = await this.model.findById({ _id });
        if (!doc) throw createHttpError(404, "Not found!");
        await doc.deleteOne();
    }

    /**
     * Retrieves documents in a paginated format.
     *
     * @param params.page - The page number (1-based).
     * @param params.perPage - Number of documents per page.
     * @param params.filters - Optional filters to apply.
     * @param params.sort - Optional sorting criteria.
     * @param params.virtuals - Whether to include virtuals in lean queries.
     * @param params.populate - Whether to populate referenced paths.
     * @param params.populatePath - Specific paths to populate.
     * @returns Array of documents for the requested page.
     */
    async paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<any> {
        const { page, perPage, filters = {}, sort = {}, virtuals = false, populatePath, populate } = params;

        const query = this.model
            .find(filters)
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (populate) query.populate(populatePath || this.populateRefs);
        return query.lean(virtuals && { virtuals });
    }

    /**
     * Protected helper to throw duplicate key errors.
     *
     * Should be overridden by subclasses to provide model-specific
     * field-level error messages.
     *
     * @param indexString - The MongoDB index name that was violated.
     * @throws {Error} Default implementation throws a generic error.
     */
    protected throwDuplicateError(indexString: string) {
        throw new Error(`Duplicate Error: ${indexString}`);
    }

    /**
     * Protected helper to throw fetch errors.
     *
     * Converts Mongoose DocumentNotFoundError to HTTP 404 error.
     *
     * @param error - The original error thrown by Mongoose.
     * @throws {HttpError} 404 if document not found, otherwise rethrows original error.
     */
    protected throwFetchError(error: unknown): void {
        if (error instanceof Error && error.name === 'DocumentNotFoundError') {
            throw createHttpError(404, "Not found!");
        } else {
            throw error;
        }
    }

    /**
     * Protected helper to handle persistence errors.
     *
     * Converts MongoDB duplicate key errors into calls to `throwDuplicateError`.
     * Otherwise delegates to `throwFetchError`.
     *
     * @param error - The original error thrown by Mongoose during save or update.
     * @throws {ZodParseError|HttpError} Based on the underlying error type.
     */
    protected throwPersistError(error: unknown): void {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            const indexName = (error as any).errmsg.match(/index: (\S+)/)?.[1];
            console.log("Error Index: ", indexName);

            this.throwDuplicateError(indexName);
        } else {
            this.throwFetchError(error);
        }
    }
}
