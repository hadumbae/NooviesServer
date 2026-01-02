/**
 * @file BaseRepository.ts
 *
 * Generic base repository for Mongoose-backed persistence.
 *
 * Provides a standardized CRUD and pagination implementation with:
 * - Consistent error normalization
 * - Duplicate index detection
 * - Optional population and virtual handling
 *
 * Intended to be extended or used directly by concrete repositories.
 */

import { Error, type Model } from "mongoose";
import createHttpError from "http-errors";
import type { PopulatePath } from "../types/mongoose/PopulatePath.js";
import type BaseRepositoryCRUD from "./BaseRepositoryCRUD.js";
import type {
    BaseRepositoryCountParams,
    BaseRepositoryCreateParams,
    BaseRepositoryDestroyParams,
    BaseRepositoryFindByIDParams,
    BaseRepositoryFindBySlugParams,
    BaseRepositoryFindParams,
    BaseRepositoryPaginationParams,
    BaseRepositoryUpdateParams
} from "./BaseRepository.types.js";
import DuplicateIndexError from "../errors/DuplicateIndexError.js";
import type { ModelObject } from "../types/ModelObject.js";
import populateQuery from "../utility/mongoose/populateQuery.js";

/**
 * Constructor options for {@link BaseRepository}.
 *
 * @typeParam TSchema - Persisted document shape.
 */
interface BaseRepositoryConstructor<TSchema extends ModelObject> {
    /** Backing Mongoose model */
    readonly model: Model<TSchema>;
    /** Default populate paths */
    readonly populateRefs?: PopulatePath[];
}

/**
 * Generic CRUD and pagination repository for Mongoose models.
 *
 * @typeParam TSchema - Persisted document shape.
 * @typeParam TInput  - Input payload shape for create/update operations.
 */
export default class BaseRepository<TSchema extends ModelObject, TInput = unknown>
    implements BaseRepositoryCRUD<TSchema> {

    private readonly model: Model<TSchema>;
    private readonly populateRefs: PopulatePath[];

    /**
     * Creates a repository instance.
     *
     * @param model - Backing Mongoose model
     * @param populateRefs - Default populate paths
     */
    constructor({ model, populateRefs }: BaseRepositoryConstructor<TSchema>) {
        this.model = model;
        this.populateRefs = populateRefs ?? [];
    }

    /**
     * Counts documents matching optional filters.
     *
     * @param params - Filter parameters
     * @returns Matching document count
     */
    async count({ filters }: BaseRepositoryCountParams<TSchema> = {}): Promise<number> {
        return this.model.countDocuments(filters ?? {});
    }

    /**
     * Retrieves multiple documents.
     *
     * @param params - Filters and request options
     * @returns Matching documents
     */
    async find(params: BaseRepositoryFindParams<TSchema> = {}): Promise<TSchema[]> {
        const {
            filters,
            options: { populatePaths = this.populateRefs, populate, virtuals, limit } = {},
        } = params;

        const query = populateQuery({
            query: this.model.find(filters ?? {}),
            options: { populate, virtuals, populatePaths },
        });

        if (typeof limit === "number") {
            query.limit(limit);
        }

        return query;
    }

    /**
     * Retrieves a document by ObjectId.
     *
     * @param params - Identifier and request options
     * @returns Matching document
     * @throws 404 if not found
     */
    async findById(params: BaseRepositoryFindByIDParams): Promise<TSchema> {
        const {
            _id,
            options: { populatePaths = this.populateRefs, populate, virtuals } = {}
        } = params;

        try {
            const query = populateQuery({
                query: this.model.findById(_id),
                options: { populate, virtuals, populatePaths },
            });

            return query.orFail();
        } catch (error: unknown) {
            this.throwFetchError(error);
        }
    }

    /**
     * Retrieves a document by slug.
     *
     * @param params - Slug identifier and request options
     * @returns Matching document
     * @throws 404 if not found
     */
    async findBySlug(params: BaseRepositoryFindBySlugParams): Promise<TSchema> {
        const {
            slug,
            options: { populatePaths = this.populateRefs, populate, virtuals } = {},
        } = params;

        try {
            const query = populateQuery({
                query: this.model.findOne({ slug }),
                options: { populate, virtuals, populatePaths },
            });

            return query.orFail();
        } catch (error: unknown) {
            this.throwFetchError(error);
        }
    }

    /**
     * Creates and persists a document.
     *
     * @param params - Creation payload and options
     * @returns Created document
     */
    async create(params: BaseRepositoryCreateParams<TInput>): Promise<TSchema> {
        const {
            data,
            options: { populatePaths = this.populateRefs, populate, virtuals } = {},
        } = params;

        try {
            const doc = await this.model.create(data);
            const query = populateQuery({
                query: this.model.findById(doc._id),
                options: { populate, virtuals, populatePaths },
            });

            return query.orFail();
        } catch (error: unknown) {
            this.throwPersistError(error);
        }
    }

    /**
     * Updates a document by ObjectId.
     *
     * @param params - Identifier, update data, and options
     * @returns Updated document
     */
    async update(params: BaseRepositoryUpdateParams<TSchema, TInput>): Promise<TSchema> {
        const {
            _id,
            data,
            unset,
            options: { populatePaths = this.populateRefs, populate, virtuals } = {},
        } = params;

        const updateObject: Record<string, unknown> = { $set: data };
        if (unset) updateObject.$unset = unset;

        try {
            const query = populateQuery({
                query: this.model.findByIdAndUpdate(_id, updateObject, { new: true }),
                options: { populate, virtuals, populatePaths },
            });

            return query.orFail();
        } catch (error: unknown) {
            this.throwPersistError(error);
        }
    }

    /**
     * Deletes a document by ObjectId.
     *
     * @param params - Document identifier
     * @throws 404 if not found
     */
    async destroy({ _id }: BaseRepositoryDestroyParams): Promise<void> {
        const doc = await this.model.findById({ _id });
        if (!doc) throw createHttpError(404, "Not found!");

        await doc.deleteOne();
    }

    /**
     * Retrieves documents using pagination.
     *
     * @param params - Pagination, filters, sorting, and options
     * @returns Documents for the requested page
     */
    async paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<TSchema[]> {
        const {
            page,
            perPage,
            filters,
            sort,
            options: { populatePaths = this.populateRefs, virtuals, populate } = {},
        } = params;

        const query = this.model
            .find(filters ?? {})
            .sort(sort ?? {})
            .skip((page - 1) * perPage)
            .limit(perPage);

        return populateQuery({
            query,
            options: { populate, virtuals, populatePaths },
        });
    }

    /**
     * Throws a normalized duplicate index error.
     *
     * @param indexString - Violated MongoDB index name
     */
    protected throwDuplicateError(indexString: string): never {
        throw new DuplicateIndexError({
            message: `Duplicate Error: ${indexString}`,
            index: indexString,
            model: this.model.modelName,
        });
    }

    /**
     * Normalizes fetch-related errors.
     *
     * @param error - Error thrown during retrieval
     * @throws 404 or rethrows the original error
     */
    protected throwFetchError(error: unknown): never {
        if (error instanceof Error && error.name === "DocumentNotFoundError") {
            throw createHttpError(404, "Not found!");
        }

        throw error;
    }

    /**
     * Normalizes persistence-related errors.
     *
     * @param error - Error thrown during write operations
     */
    protected throwPersistError(error: unknown): never {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            const indexName = (error as any).errmsg.match(/index: (\S+)/)?.[1];
            this.throwDuplicateError(indexName);
        }

        if (error instanceof Error && error.name === "DocumentNotFoundError") {
            throw createHttpError(500, "An error occurred. Please try again.");
        }

        throw error;
    }
}
