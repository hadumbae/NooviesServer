/**
 * @file Base interfaces and compositions for Mongoose domain models.
 * @filename BaseModel.ts
 */

import {Types} from "mongoose";
import type {ModelTimestamps} from "./ModelTimestamps.js";
import type {ModelSoftDelete} from "./ModelSoftDelete.js";
import type {SlugString} from "../../schema/strings/SlugStringSchema.js";
import type {UniqueCode} from "@shared/validation/codes";

/**
 * Minimal record structure containing the standard Mongoose identification field.
 */
export type BaseModel = {
    /** Primary database key represented as a BSON {@link Types.ObjectId}. */
    readonly _id: Types.ObjectId;
};

/**
 * An extension of the base model that includes a URL-friendly unique identifier.
 */
export type BaseModelWithSlug = BaseModel & {
    /** SEO-friendly, unique string used for resource routing. */
    slug: SlugString;
}

/**
 * An extension of the base model that includes a standardized system code.
 */
export type BaseModelWithUniqueCode = BaseModel & {
    /**
     * Standardized alphanumeric identifier (e.g., USR-XXXXX-XXXXX).
     * @see {@link UniqueCode}
     */
    unique: UniqueCode;
}

/**
 * Composition of core database traits including audit trails and soft-deletion capability.
 */
export type BaseSoftDeleteModel = BaseModel & ModelTimestamps & ModelSoftDelete;