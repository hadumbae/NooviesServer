import type {ModelObject} from "../../types/ModelObject.js";
import type {CRUDCreateParams, CRUDUpdateParams, WriteMethods} from "./CRUDWriter.types.js";
import populateQuery from "../../utility/mongoose/populateQuery.js";
import {CRUDBase} from "../base/CRUDBase.js";
import {DocumentVersionError} from "../../errors/DocumentVersionError.js";

/**
 * @file CRUDWriter.ts
 *
 * Generic create/update service for Mongoose-backed models.
 * Handles persistence, population, optimistic locking retries,
 * and normalized persistence error handling.
 */

/**
 * Generic write-layer CRUD service.
 *
 * Provides `create` and `update` operations with:
 * - Optional population & virtuals
 * - `$unset` support
 * - Optimistic concurrency retry handling
 *
 * @template TSchema - Persisted document shape
 * @template TInput - Incoming write payload shape
 */
export class CRUDWriter<TSchema extends ModelObject, TInput = unknown>
    extends CRUDBase<TSchema>
    implements WriteMethods<TSchema, TInput> {

    /**
     * Creates and persists a new document.
     *
     * Automatically re-fetches the document to apply population
     * and virtuals after creation.
     *
     * @param params - Create payload and query options
     * @returns Persisted and populated document
     *
     * @throws Persistence-related errors via `PersistenceManager`
     */
    async create(params: CRUDCreateParams<TInput>): Promise<TSchema> {
        const {
            data,
            options: {populatePaths = this.populateRefs, populate, virtuals} = {},
        } = params;

        try {
            const doc = await this.model.create(data);

            const query = populateQuery({
                query: this.model.findById(doc._id),
                options: {populate, virtuals, populatePaths},
            });

            return query.orFail();
        } catch (error: unknown) {
            this.persistenceManager.throwPersistError(error);
        }
    }

    /**
     * Updates an existing document by ObjectId.
     *
     * Features:
     * - Partial updates via `$set`
     * - Optional `$unset` handling
     * - Automatic population after save
     * - Retry logic for Mongoose `VersionError`
     *
     * @param params - Identifier, update payload, and options
     * @returns Updated and populated document
     *
     * @throws DocumentVersionError when optimistic locking fails
     * @throws Persistence-related errors via `PersistenceManager`
     */
    async update(params: CRUDUpdateParams<TSchema, TInput>): Promise<TSchema> {
        const {_id, data, unset, options = {}, retries = 3} = params;
        const {populate, virtuals, populatePaths = this.populateRefs} = options;

        const doc = await this.model.findById({_id}).orFail();

        doc.set(data);
        if (unset) Object.keys(unset).forEach(key => doc.set(key, undefined));

        try {
            await doc.save();

            const query = populateQuery({
                query: this.model.findById(_id),
                options: {populate, virtuals, populatePaths},
            });

            return query.orFail();
        } catch (error: unknown) {
            if (error instanceof Error && error.name === "VersionError") {
                if (retries > 0) {
                    return this.update({...params, retries: retries - 1});
                }

                throw new DocumentVersionError({
                    _id,
                    model: this.model.modelName,
                    raw: data,
                });
            }

            this.persistenceManager.throwPersistError(error);
        }
    }
}