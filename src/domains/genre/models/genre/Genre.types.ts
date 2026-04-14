/**
 * @fileoverview Type definitions for the Genre persistence model.
 * Defines the database shape, including assets, metrics, and identity.
 */

import type {CloudinaryImageObject} from "@shared/schema/cloudinary/CloudinaryImageObjectSchema";
import {Types} from "mongoose";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {ModelTimestamps} from "@shared/types/schema/ModelTimestamps";

/**
 * Shape of a Genre document within MongoDB.
 */
export type GenreSchemaFields = BaseModel & ModelTimestamps & {
    /** The unique MongoDB identifier. */
    readonly _id: Types.ObjectId;

    /** Public-facing display name. */
    name: string;

    /** Summary of genre characteristics and themes. */
    description: string;

    /** URL-safe unique identifier for routing. */
    slug: string;

    /** Primary representative image metadata. */
    image?: CloudinaryImageObject | null;

    /** Aggregated count of associated movies. */
    movieCount: number;
};