/**
 * @fileoverview Defines base TypeScript types for Mongoose models used across the application.
 */

import {Types} from "mongoose";
import type {ModelTimestamps} from "@/shared/_types/model/ModelTimestamps.js";
import type {ModelSoftDelete} from "@/shared/_types/model/ModelSoftDelete.js";
import type {SlugString} from "@/shared/schema/strings/SlugStringSchema.js";
import type {UniqueCode} from "@/shared/_schema/codes";

/** Base model type containing the standard MongoDB identifier. */
export type BaseModel = {
    readonly _id: Types.ObjectId;
};

/** Model type that includes a URL-friendly slug string. */
export type BaseModelWithSlug = BaseModel & {
    slug: SlugString;
}

/** Model type that includes a unique business code. */
export type BaseModelWithUniqueCode = BaseModel & {
    unique: UniqueCode;
}

/** Model type that includes timestamp tracking and soft delete capabilities. */
export type BaseSoftDeleteModel = BaseModel & ModelTimestamps & ModelSoftDelete;