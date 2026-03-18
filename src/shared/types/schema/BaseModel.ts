/**
 * @file Base interfaces for Mongoose domain models.
 * @filename BaseModel.ts
 */

import {Types} from "mongoose";
import type {ModelTimestamps} from "./ModelTimestamps.js";
import type {ModelSoftDelete} from "./ModelSoftDelete.js";

/**
 * Minimal record structure with a BSON {@link Types.ObjectId}.
 */
export type BaseModel = {
    /** Primary key via {@link Types.ObjectId}. */
    _id: Types.ObjectId;
};

/**
 * Composition of {@link BaseModel}, {@link ModelTimestamps}, and {@link ModelSoftDelete}.
 * Used for standard business entities with audit trails and soft-deletion.
 */
export type BaseSoftDeleteModel = BaseModel & ModelTimestamps & ModelSoftDelete;