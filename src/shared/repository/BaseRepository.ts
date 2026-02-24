/**
 * @file Base repository for CRUD persistence.
 * BaseRepository.ts
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
 * Composes read, write, and delete operations for Mongoose-backed models.
 */
export class BaseRepository<TSchema extends ModelObject, TInput = unknown>
    extends CRUDBase<TSchema>
    implements
        ReadMethods<TSchema>,
        WriteMethods<TSchema, TInput>,
        DeleteMethods
{
    protected reader: CRUDReader<TSchema>;
    protected writer: CRUDWriter<TSchema, TInput>;
    protected deleter: CRUDDeleter<TSchema>;

    /**
     * Initializes CRUD operation handlers.
     */
    constructor(params: BaseRepositoryConstructor<TSchema, TInput>) {
        const { reader, writer, deleter, ...superParams } = params;

        super(superParams);

        this.reader = reader ?? new CRUDReader(superParams);
        this.writer = writer ?? new CRUDWriter(superParams);
        this.deleter = deleter ?? new CRUDDeleter(superParams);
    }

    /**
     * Returns document count.
     */
    async count(params: CRUDCountParams<TSchema> = {}): Promise<number> {
        return this.reader.count(params);
    }

    /**
     * Retrieves matching documents.
     */
    async find(params: CRUDFindParams<TSchema> = {}): Promise<TSchema[]> {
        return this.reader.find(params);
    }

    /**
     * Retrieves a document by ObjectId.
     */
    async findById(params: CRUDFindByIDParams): Promise<TSchema> {
        return this.reader.findById(params);
    }

    /**
     * Retrieves a document by slug.
     */
    async findBySlug(params: CRUDFindBySlugParams): Promise<TSchema> {
        return this.reader.findBySlug(params);
    }

    /**
     * Retrieves paginated documents.
     */
    async paginate(params: CRUDPaginationParams<TSchema>): Promise<TSchema[]> {
        return this.reader.paginate(params);
    }

    /**
     * Executes the raw create operation.
     */
    async createAction(params: CRUDCreateParams<TInput>): Promise<TSchema> {
        return this.writer.createAction(params);
    }

    /**
     * Creates a document.
     */
    async create(params: CRUDCreateParams<TInput>): Promise<TSchema> {
        return this.writer.create(params);
    }

    /**
     * Executes the raw update operation.
     */
    async updateAction(params: CRUDUpdateActionParams<TSchema, TInput>): Promise<TSchema> {
        return this.writer.updateAction(params);
    }

    /**
     * Updates a document.
     */
    async update(params: CRUDUpdateParams<TSchema, TInput>): Promise<TSchema> {
        return this.writer.update(params);
    }

    /**
     * Deletes a document.
     */
    async destroy(params: CRUDDestroyParams): Promise<void> {
        return this.deleter.destroy(params);
    }
}