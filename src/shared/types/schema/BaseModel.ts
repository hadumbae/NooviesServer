/**
 * @file Base interfaces for Mongoose domain models.
 * @filename BaseModel.ts
 */

import {Types} from "mongoose";
import type {ModelTimestamps} from "./ModelTimestamps.js";
import type {ModelSoftDelete} from "./ModelSoftDelete.js";
import type {SlugString} from "../../schema/strings/SlugStringSchema.js";

/**
 * Minimal record structure with a BSON {@link Types.ObjectId}.
 */
export type BaseModel = {
    /** Primary key via {@link Types.ObjectId}. */
    readonly _id: Types.ObjectId;
};

/**
 * An extension of the base model that includes a URL-friendly unique identifier.
 */
export type BaseModelWithSlug = BaseModel & {
    slug: SlugString;
}

/**
 * Composition of {@link BaseModel}, {@link ModelTimestamps}, and {@link ModelSoftDelete}.
 * Used for standard business entities with audit trails and soft-deletion.
 */
export type BaseSoftDeleteModel = BaseModel & ModelTimestamps & ModelSoftDelete;