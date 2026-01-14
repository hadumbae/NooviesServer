import type {ModelObject} from "../../types/ModelObject.js";
import type {CRUDCreateParams, CRUDUpdateParams, WriteMethods} from "./CRUDWriter.types.js";
import populateQuery from "../../utility/mongoose/populateQuery.js";
import {CRUDBase} from "../base/CRUDBase.js";

/**
 * @file CRUDWriter.ts
 *
 * Generic write (create/update) CRUD service for Mongoose models.
 */

/**
 * Provides write operations for a Mongoose-backed model.
 *
 * @template TSchema - Persisted document shape
 * @template TInput  - Input payload shape
 */
export class CRUDWriter<TSchema extends ModelObject, TInput = unknown>
    extends CRUDBase<TSchema>
    implements WriteMethods<TSchema, TInput>
{
    /**
     * Creates and persists a document.
     *
     * @param params - Creation payload and request options
     * @returns Created document
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
     * Updates a document by ObjectId.
     *
     * Supports `$set` and optional `$unset`.
     *
     * @param params - Identifier, update payload, and request options
     * @returns Updated document
     */
    async update(params: CRUDUpdateParams<TSchema, TInput>): Promise<TSchema> {
        const {
            _id,
            data,
            unset,
            options: {populatePaths = this.populateRefs, populate, virtuals} = {},
        } = params;

        const updateObject: Record<string, unknown> = {$set: data};
        if (unset) {
            updateObject.$unset = unset;
        }

        try {
            const query = populateQuery({
                query: this.model.findByIdAndUpdate(_id, updateObject, {new: true}),
                options: {populate, virtuals, populatePaths},
            });

            return query.orFail();
        } catch (error: unknown) {
            this.persistenceManager.throwPersistError(error);
        }
    }
}
