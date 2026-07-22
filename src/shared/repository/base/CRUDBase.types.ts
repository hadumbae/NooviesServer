/**
 * @file CRUDBase.types.ts
 *
 * Type definitions for constructing CRUD base repositories.
 */

import type {ModelObject} from "@/shared/_types/model/ModelObject";
import type {Model} from "mongoose";
import type {PopulatePath} from "@/shared/_types/mongoose/PopulatePath";
import {PersistenceManager} from "../managers/PersistenceManager.js";

/**
 * Constructor parameters for {@link CRUDBase}.
 *
 * @template TSchema - Mongoose schema object type.
 */
export type CRUDBaseConstructor<TSchema extends ModelObject> = {
    /** Backing Mongoose model instance. */
    readonly model: Model<TSchema>;

    /** Default populate paths applied to read operations. */
    readonly populateRefs?: PopulatePath[];

    /**
     * Optional persistence manager instance.
     *
     * When omitted, a default {@link PersistenceManager}
     * is created using the model name.
     */
    readonly persistenceManager?: PersistenceManager;
};