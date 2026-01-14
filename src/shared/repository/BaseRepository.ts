/**
 * @file BaseRepository.ts
 *
 * Generic base repository for Mongoose-backed persistence.
 *
 * Provides a standardized CRUD implementation with:
 * - Delegated read/write/delete operations
 * - Consistent error normalization
 * - Optional population and virtual handling
 *
 * Intended to be extended or composed by concrete repositories.
 */

import type {ModelObject} from "../types/ModelObject.js";
import type {
    CRUDCountParams,
    CRUDFindByIDParams,
    CRUDFindBySlugParams,
    CRUDFindParams,
    CRUDPaginationParams,
    ReadMethods
} from "./operations/CRUDReader.types.js";
import type {
    CRUDCreateParams,
    CRUDUpdateParams,
    WriteMethods
} from "./operations/CRUDWriter.types.js";
import type {
    CRUDDestroyParams,
    DeleteMethods
} from "./operations/CRUDDeleter.types.js";
import {CRUDReader} from "./operations/CRUDReader.js";
import {CRUDWriter} from "./operations/CRUDWriter.js";
import {CRUDDeleter} from "./operations/CRUDDeleter.js";
import type {BaseRepositoryConstructor} from "./BaseRepository.types.js";
import {CRUDBase} from "./base/CRUDBase.js";

/**
 * Generic CRUD repository for Mongoose models.
 *
 * @template TSchema - Persisted document shape
 * @template TInput  - Input payload shape for create/update operations
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
     * Creates a new repository instance.
     *
     * Allows optional injection of CRUD operation handlers.
     *
     * @param params - Repository construction parameters
     */
    constructor(params: BaseRepositoryConstructor<TSchema, TInput>) {
        const {reader, writer, deleter, ...superParams} = params;

        super(superParams);

        this.reader = reader ?? new CRUDReader(superParams);
        this.writer = writer ?? new CRUDWriter(superParams);
        this.deleter = deleter ?? new CRUDDeleter(superParams);
    }

    /** @inheritdoc */
    async count(params: CRUDCountParams<TSchema> = {}): Promise<number> {
        return this.reader.count(params);
    }

    /** @inheritdoc */
    async find(params: CRUDFindParams<TSchema> = {}): Promise<TSchema[]> {
        return this.reader.find(params);
    }

    /** @inheritdoc */
    async findById(params: CRUDFindByIDParams): Promise<TSchema> {
        return this.reader.findById(params);
    }

    /** @inheritdoc */
    async findBySlug(params: CRUDFindBySlugParams): Promise<TSchema> {
        return this.reader.findBySlug(params);
    }

    /** @inheritdoc */
    async paginate(params: CRUDPaginationParams<TSchema>): Promise<TSchema[]> {
        return this.reader.paginate(params);
    }

    /** @inheritdoc */
    async create(params: CRUDCreateParams<TInput>): Promise<TSchema> {
        return this.writer.create(params);
    }

    /** @inheritdoc */
    async update(params: CRUDUpdateParams<TSchema, TInput>): Promise<TSchema> {
        return this.writer.update(params);
    }

    /** @inheritdoc */
    async destroy(params: CRUDDestroyParams): Promise<void> {
        return this.deleter.destroy(params);
    }
}
