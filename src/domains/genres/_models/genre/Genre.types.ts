/**
 * @fileoverview Type definitions for the Genre persistence model.
 * Defines the database shape, including assets, metrics, and identity.
 */

import type {CloudinaryImageObject} from "@/shared/schema/cloudinary/CloudinaryImageObjectSchema";
import {Types} from "mongoose";
import type {BaseModel} from "@/shared/_types/model/BaseModel";
import type {ModelTimestamps} from "@/shared/_types/model/ModelTimestamps";

/**
 * Shape of a Genre document within MongoDB.
 */
export type GenreSchemaFields = BaseModel & ModelTimestamps & {
    readonly _id: Types.ObjectId;
    name: string;
    description: string;
    slug: string;
    image?: CloudinaryImageObject | null;
    movieCount: number;
};