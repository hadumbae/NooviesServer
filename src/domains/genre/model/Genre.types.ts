/**
 * @file Type definition for the Genre persistence model.
 * @filename Genre.types.ts
 */

import type {CloudinaryImageObject} from "../../../shared/schema/cloudinary/CloudinaryImageObjectSchema.js";
import {Types} from "mongoose";
import type {BaseModel} from "../../../shared/types/schema/BaseModel.js";
import type {ModelTimestamps} from "../../../shared/types/schema/ModelTimestamps.js";

/**
 * Represents the comprehensive shape of a Genre document in the database.
 * * * **Composition:** Combines {@link BaseModel} and {@link ModelTimestamps} for lifecycle and identity tracking.
 * * **Assets:** Includes both a primary `image` (thumbnail/card) and an optional `bannerImage` for hero sections.
 * * **Metrics:** Maintains a `movieCount` to support category-level analytics and UI badges.
 */
export type GenreSchemaFields = BaseModel & ModelTimestamps & {
    /** The unique MongoDB identifier for the genre. */
    readonly _id: Types.ObjectId;

    /** Public-facing name of the genre (e.g., "Sci-Fi", "Horror"). */
    name: string;

    /** A brief summary of the genre's characteristics and themes. */
    description: string;

    /** URL-safe unique string used for category-based routing. */
    slug: string;

    /** Metadata for the genre's primary representative image. */
    image?: CloudinaryImageObject | null;

    /** Total number of movies currently associated with this genre. */
    movieCount: number;
}