/**
 * @file CRUDBase.ts
 *
 * Base class for Mongoose-backed CRUD repositories with
 * centralized persistence error handling.
 */

import type {Model} from "mongoose";
import type {PopulatePath} from "../../types/mongoose/PopulatePath.js";
import type {ModelObject} from "../../types/ModelObject.js";
import type {CRUDBaseConstructor} from "./CRUDBase.types.js";
import {PersistenceManager} from "../managers/PersistenceManager.js";

/**
 * **CRUDBase**
 *
 * Provides shared repository infrastructure:
 * - Access to the backing Mongoose model
 * - Default populate configuration
 * - Centralized persistence error normalization
 *
 * @template TSchema - Mongoose schema object type.
 */
export class CRUDBase<TSchema extends ModelObject> {
    /** Backing Mongoose model instance. */
    readonly model: Model<TSchema>;

    /** Default populate paths applied to read operations. */
    readonly populateRefs: PopulatePath[];

    /** Persistence error handler for repository operations. */
    readonly persistenceManager: PersistenceManager;

    /**
     * Create a CRUD repository base instance.
     *
     * @param params - {@link CRUDBaseConstructor}
     */
    constructor({model, populateRefs, persistenceManager}: CRUDBaseConstructor<TSchema>) {
        this.model = model;
        this.populateRefs = populateRefs ?? [];
        this.persistenceManager = persistenceManager ?? new PersistenceManager({modelName: model.modelName});
    }
}
