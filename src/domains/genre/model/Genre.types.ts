import type {CloudinaryImageObject} from "../../../shared/schema/cloudinary/CloudinaryImageObjectSchema.js";
import {Types} from "mongoose";

/**
 * Genre entity.
 */
export interface GenreSchemaFields {
    /** The unique MongoDB ObjectId for the genre. Read-only. */
    _id: Types.ObjectId;

    /** Display name of the genre. */
    name: string;

    /** Descriptive text for the genre. */
    description: string;

    /** Associated image asset. */
    image: CloudinaryImageObject;

    /** URL-friendly identifier. */
    slug: string;
}
