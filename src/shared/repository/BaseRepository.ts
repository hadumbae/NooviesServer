/**
 * @file Orchestration layer for CRUD persistence across Mongoose models.
 * @filename BaseRepository.ts
 */

import type { ModelObject } from "../types/ModelObject.js";
import type {
    CRUDCountParams,
    CRUDFindByIDParams,
    CRUDFindBySlugParams,
    CRUDFindParams,
    CRUDPaginationParams,
    ReadMethods,
} from "./operations/CRUDReader.types.js";
import type {
    CRUDCreateParams,
    CRUDUpdateActionParams,
    CRUDUpdateParams,
    WriteMethods,
} from "./operations/CRUDWriter.types.js";
import type {
    CRUDDestroyParams,
    DeleteMethods,
} from "./operations/CRUDDeleter.types.js";
import { CRUDReader } from "./operations/CRUDReader.js";
import { CRUDWriter } from "./operations/CRUDWriter.js";
import { CRUDDeleter } from "./operations/CRUDDeleter.js";
import type { BaseRepositoryConstructor } from "./BaseRepository.types.js";
import { CRUDBase } from "./base/CRUDBase.js";

/**
 * Abstract-style repository that aggregates {@link CRUDReader}, {@link CRUDWriter}, and {@link CRUDDeleter}.
 * * Provides a unified interface for database interactions while delegating specific logic
 * to specialized operation handlers.
 * * @template TSchema - The Mongoose model interface (e.g., `ShowingSchemaFields`).
 * @template TInput - The DTO or input shape for creation and updates.
 */
export class BaseRepository<TSchema extends ModelObject, TInput = unknown>
    extends CRUDBase<TSchema>
    implements
        ReadMethods<TSchema>,
        WriteMethods<TSchema, TInput>,
        DeleteMethods<TSchema>
{
    /** Specialized handler for read-only queries. */
    protected reader: CRUDReader<TSchema>;
    /** Specialized handler for creation and modification. */
    protected writer: CRUDWriter<TSchema, TInput>;
    /** Specialized handler for document removal and soft-deletion. */
    protected deleter: CRUDDeleter<TSchema>;

    /**
     * Initializes operation handlers. If handlers are not provided via {@link BaseRepositoryConstructor},
     * default instances are created using the shared `superParams`.
     */
    constructor(params: BaseRepositoryConstructor<TSchema, TInput>) {
        const { reader, writer, deleter, ...superParams } = params;

        super(superParams);

        this.reader = reader ?? new CRUDReader(superParams);
        this.writer = writer ?? new CRUDWriter(superParams);
        this.deleter = deleter ?? new CRUDDeleter(superParams);
    }

    /**
     * Retrieves total document count based on {@link CRUDCountParams}.
     */
    async count(params: CRUDCountParams<TSchema> = {}): Promise<number> {
        return this.reader.count(params);
    }

    /**
     * Fetches a collection of documents matching {@link CRUDFindParams}.
     */
    async find(params: CRUDFindParams<TSchema> = {}): Promise<TSchema[]> {
        return this.reader.find(params);
    }

    /**
     * Finds a single record by its primary {@link Types.ObjectId}.
     */
    async findById(params: CRUDFindByIDParams): Promise<TSchema> {
        return this.reader.findById(params);
    }

    /**
     * Finds a single record by its unique {@link SlugString}.
     */
    async findBySlug(params: CRUDFindBySlugParams): Promise<TSchema> {
        return this.reader.findBySlug(params);
    }

    /**
     * Retrieves a subset of documents via {@link CRUDPaginationParams}.
     */
    async paginate(params: CRUDPaginationParams<TSchema>): Promise<TSchema[]> {
        return this.reader.paginate(params);
    }

    /**
     * Low-level creation logic via {@link CRUDWriter}.
     */
    async createAction(params: CRUDCreateParams<TInput>): Promise<TSchema> {
        return this.writer.createAction(params);
    }

    /**
     * Persists a new document to the collection.
     */
    async create(params: CRUDCreateParams<TInput>): Promise<TSchema> {
        return this.writer.create(params);
    }

    /**
     * Low-level update logic via {@link CRUDWriter}.
     */
    async updateAction(params: CRUDUpdateActionParams<TSchema, TInput>): Promise<TSchema> {
        return this.writer.updateAction(params);
    }

    /**
     * Modifies an existing document.
     */
    async update(params: CRUDUpdateParams<TSchema, TInput>): Promise<TSchema> {
        return this.writer.update(params);
    }

    /**
     * Permanently deletes a record.
     */
    async destroy(params: CRUDDestroyParams): Promise<void> {
        return this.deleter.destroy(params);
    }

    /**
     * Flags a record as deleted using {@link ModelSoftDelete} logic.
     */
    async softDelete(params: CRUDDestroyParams): Promise<TSchema> {
        return this.deleter.softDelete(params);
    }
}