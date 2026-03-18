/**
 * @file Generic write-layer CRUD service.
 * CRUDWriter.ts
 */

import type { ModelObject } from "../../types/ModelObject.js";
import type {
    CRUDCreateParams,
    CRUDUpdateActionParams,
    CRUDUpdateParams,
    WriteMethods,
} from "./CRUDWriter.types.js";
import populateQuery from "../../utility/mongoose/populateQuery.js";
import { CRUDBase } from "../base/CRUDBase.js";
import { DocumentVersionError } from "../../errors/DocumentVersionError.js";

/**
 * Create and update operations with population and optimistic concurrency handling.
 */
export class CRUDWriter<TSchema extends ModelObject, TInput = unknown>
    extends CRUDBase<TSchema>
    implements WriteMethods<TSchema, TInput> {

    /**
     * Performs the raw create operation and re-fetches for population.
     */
    async createAction(params: CRUDCreateParams<TInput>): Promise<TSchema> {
        const {
            data,
            options: { populatePaths = this.populateRefs, populate, virtuals } = {},
        } = params;

        const newDoc = new this.model(data);
        const doc = await newDoc.save();

        const query = populateQuery({
            query: this.model.findById(doc._id),
            options: { populate, virtuals, populatePaths },
        });

        return query.orFail();
    }

    /**
     * Creates a document with normalized persistence error handling.
     */
    async create(params: CRUDCreateParams<TInput>): Promise<TSchema> {
        try {
            return this.createAction(params);
        } catch (error: unknown) {
            this.persistenceManager.throwPersistError(error);
        }
    }

    /**
     * Performs the raw update and re-fetches for population.
     */
    async updateAction(params: CRUDUpdateActionParams<TSchema, TInput>): Promise<TSchema> {
        const { _id, data, unset, options = {} } = params;
        const { populate, virtuals, populatePaths = this.populateRefs } = options;

        const doc = await this.model.findById({ _id }).orFail();

        doc.set(data);
        if (unset) Object.keys(unset).forEach(key => doc.set(key, undefined));

        await doc.save();

        const query = populateQuery({
            query: this.model.findById(_id),
            options: { populate, virtuals, populatePaths },
        });

        return query.orFail();
    }

    /**
     * Updates a document with retry support for optimistic locking conflicts.
     */
    async update(params: CRUDUpdateParams<TSchema, TInput>): Promise<TSchema> {
        const { _id, data, retries = 3 } = params;

        try {
            return this.updateAction(params);
        } catch (error: unknown) {
            if (error instanceof Error && error.name === "VersionError") {
                if (retries > 0) {
                    return this.update({ ...params, retries: retries - 1 });
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