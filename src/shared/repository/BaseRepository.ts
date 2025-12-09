import {Error, type Model} from "mongoose";
import createHttpError from "http-errors";
import type {PopulatePath} from "../types/mongoose/PopulatePath.js";
import type BaseRepositoryCRUD from "./BaseRepositoryCRUD.js";
import type {
    BaseRepositoryCountParams,
    BaseRepositoryCreateParams,
    BaseRepositoryDestroyParams,
    BaseRepositoryFindByIDParams,
    BaseRepositoryFindParams,
    BaseRepositoryPaginationParams,
    BaseRepositoryUpdateParams
} from "./BaseRepository.types.js";
import DuplicateIndexError from "../errors/DuplicateIndexError.js";

/**
 * Constructor options for {@link BaseRepository}.
 *
 * @template TSchema - Mongoose document type handled by the repository.
 */
interface BaseRepositoryConstructor<TSchema> {
    /** Mongoose model used for all CRUD operations. */
    readonly model: Model<TSchema>;
    /** Default populate paths applied when no explicit paths are provided. */
    readonly populateRefs?: PopulatePath[];
}

/**
 * Generic base repository implementing common CRUD and pagination
 * functionality for Mongoose models.
 *
 * Provides consistent error handling, uniqueness-violation detection,
 * and optional population/virtual configuration across operations.
 *
 * @template TSchema - Mongoose document type handled by the repository.
 */
export default class BaseRepository<TSchema extends Record<string, unknown>>
    implements BaseRepositoryCRUD<TSchema>
{
    private readonly model: Model<TSchema>;
    private readonly populateRefs: PopulatePath[];

    /**
     * Creates a new repository instance.
     *
     * @param model - The backing Mongoose model.
     * @param populateRefs - Optional default populate reference paths.
     */
    constructor({model, populateRefs}: BaseRepositoryConstructor<TSchema>) {
        this.model = model;
        this.populateRefs = populateRefs ?? [];
    }

    /**
     * Counts documents matching optional filters.
     *
     * @param filters - Optional MongoDB filter conditions.
     * @returns Number of matching documents.
     */
    async count({filters}: BaseRepositoryCountParams<TSchema> = {}): Promise<number> {
        return this.model.countDocuments(filters ?? {});
    }

    /**
     * Finds documents matching the given query parameters.
     *
     * @param params.filters - Optional MongoDB filter conditions.
     * @param params.options.populate - Enable population on this query.
     * @param params.options.populatePaths - Override default populate paths.
     * @param params.options.virtuals - Include virtuals via `lean({virtuals})`.
     * @param params.options.limit - Optional maximum result count.
     * @returns Array of documents matching the filters.
     */
    async find(params: BaseRepositoryFindParams<TSchema> = {}): Promise<TSchema[]> {
        const {filters, options: {populatePaths, populate, virtuals, limit} = {}} = params;

        // $ Find Documents
        const query = this.model.find(filters ?? {});

        // $ Apply Query Options
        if (typeof limit === "number") query.limit(limit);
        if (populate) query.populate(populatePaths || this.populateRefs);
        if (virtuals) query.lean({virtuals: true});

        return query;
    }

    /**
     * Retrieves a document by its `_id`.
     *
     * @param params._id - ID of the target document.
     * @param params.options.populate - Enable population for this query.
     * @param params.options.populatePaths - Override default populate paths.
     * @param params.options.virtuals - Enable virtuals through lean.
     * @returns The found document.
     * @throws 404 error if the document does not exist.
     */
    async findById(params: BaseRepositoryFindByIDParams): Promise<TSchema> {
        const {_id, options: {populatePaths, populate, virtuals} = {}} = params;

        try {
            const query = this.model.findById(_id);

            // $ Populate, Append Virtuals
            if (populate) query.populate(populatePaths || this.populateRefs);
            if (virtuals) query.lean({virtuals: true});

            return query.orFail();
        } catch (error: unknown) {
            this.throwFetchError(error);
        }
    }

    /**
     * Creates and persists a new document.
     *
     * @param params.data - Document fields to create.
     * @param params.options.populate - Whether to populate after creation.
     * @param params.options.populatePaths - Override default populate paths.
     * @param params.options.virtuals - Convert to object with virtuals.
     * @returns The created document (populated/virtualized if requested).
     * @throws Duplicate index or persistence errors.
     */
    async create(params: BaseRepositoryCreateParams<TSchema>): Promise<TSchema> {
        const {data, options: {populatePaths, populate, virtuals} = {}} = params;

        try {
            // $ Save Document
            const doc = new this.model(data);
            await doc.save();

            // $ Populate, Append Virtuals
            if (populate) await doc.populate(populatePaths || this.populateRefs);
            return virtuals ? doc.toObject({virtuals: true}) : doc;
        } catch (error: unknown) {
            this.throwPersistError(error);
        }
    }

    /**
     * Updates a document by `_id`.
     *
     * @param params._id - ID of the document to update.
     * @param params.data - Fields to set via `$set`.
     * @param params.unset - Fields to remove via `$unset`.
     * @param params.options.populate - Populate after update.
     * @param params.options.populatePaths - Override default populate paths.
     * @param params.options.virtuals - Include virtuals via lean.
     * @returns The updated document.
     * @throws Duplicate key, persistence, or not-found errors.
     */
    async update(params: BaseRepositoryUpdateParams<TSchema>): Promise<TSchema> {
        const {_id, data, unset, options: {populatePaths, populate, virtuals} = {}} = params;

        // $ Create Update Object
        const updateObject: Record<string, unknown> = {$set: data};
        if (unset) updateObject.$unset = unset;

        try {
            const query = this.model.findByIdAndUpdate(_id, updateObject, {new: true});

            // $ Populate, Append Virtuals
            if (populate) query.populate(populatePaths || this.populateRefs);
            if (virtuals) query.lean({virtuals});

            return await query.orFail();
        } catch (error: unknown) {
            this.throwPersistError(error);
        }
    }

    /**
     * Deletes a document by ID.
     *
     * @param _id - ID of the document to delete.
     * @throws 404 if the document does not exist.
     */
    async destroy({_id}: BaseRepositoryDestroyParams): Promise<void> {
        // $ Find Or Fail
        const doc = await this.model.findById({_id});
        if (!doc) throw createHttpError(404, "Not found!");

        // $ Delete
        await doc.deleteOne();
    }

    /**
     * Retrieves a paginated subset of documents.
     *
     * @param params.page - 1-based page number.
     * @param params.perPage - Number of documents per page.
     * @param params.filters - Optional MongoDB filter conditions.
     * @param params.sort - Optional sort configuration.
     * @param params.options.populate - Enable population.
     * @param params.options.populatePaths - Override populate paths.
     * @param params.options.virtuals - Include virtuals in lean results.
     * @returns The documents on the requested page.
     */
    async paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<TSchema[]> {
        const {page, perPage, filters, sort, options: {populatePaths, virtuals, populate} = {}} = params;

        // $ Paginated Query, With Sorting And Filters
        const query = this.model
            .find(filters ?? {})
            .sort(sort ?? {})
            .skip((page - 1) * perPage)
            .limit(perPage);

        // $ Populate, Append Virtuals
        if (populate) query.populate(populatePaths || this.populateRefs);
        if (virtuals) query.lean({virtuals});

        return query;
    }

    /**
     * Handles duplicate index errors.
     *
     * Subclasses may override this to map index names to friendly messages.
     *
     * @param indexString - MongoDB index name that was violated.
     * @throws A {@link DuplicateIndexError}.
     */
    protected throwDuplicateError(indexString: string): never {
        throw new DuplicateIndexError({
            message: `Duplicate Error: ${indexString}`,
            index: indexString,
            model: this.model.modelName,
        });
    }

    /**
     * Normalizes Mongoose fetch errors.
     *
     * Converts `DocumentNotFoundError` to a standard 404.
     *
     * @param error - Error thrown during retrieval.
     * @throws Http 404 or rethrows original error.
     */
    protected throwFetchError(error: unknown): never {
        // $ Not Found
        if (error instanceof Error && error.name === 'DocumentNotFoundError') {
            throw createHttpError(404, "Not found!");
        }

        // $ General
        throw error;
    }

    /**
     * Normalizes persistence errors (duplicate keys, write errors).
     *
     * @param error - Error thrown during save/update operations.
     * @throws Duplicate index or translated fetch error.
     */
    protected throwPersistError(error: unknown): never {
        // $ Index Uniqueness
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            const indexName = (error as any).errmsg.match(/index: (\S+)/)?.[1];
            this.throwDuplicateError(indexName);
        }

        // $ General
        throw error;
    }
}
