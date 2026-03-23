/**
 * @file Mongoose schema definition for the Genre collection.
 * @filename Genre.schema.ts
 */

import {Schema} from "mongoose";
import type {GenreSchemaFields} from "./Genre.types.js";
import {CloudinaryImageSchema} from "../../../../shared/model/cloudinary-image/CloudinaryImage.js";

/**
 * Mongoose schema for persistent Genre documents.
 * @remarks Enforces uniqueness on names and slugs, includes timestamps, and validates movie metrics.
 */
const GenreSchema = new Schema<GenreSchemaFields>({
    /** Unique display name of the genre (max 150 characters). */
    name: {
        type: String,
        required: [true, "Name is required."],
        unique: [true, "Name must be unique."],
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
    },

    /** Detailed description of the genre (max 1000 characters). */
    description: {
        type: String,
        required: [true, "Description is required."],
        maxlength: [1000, "Description must be 1000 characters or less."],
    },

    /** Primary representative image asset via Cloudinary. */
    image: {
        type: CloudinaryImageSchema,
        default: null,
    },

    /** Counter for associated movies; must be a non-negative integer. */
    movieCount: {
        type: Number,
        default: 0,
        validate: {
            message: "Must be a non-negative integer.",
            validator: (val?: number) => val !== undefined ? (Number.isInteger(val) && val >= 0) : true,
        },
    },

    /** Unique URL-friendly string used for routing. */
    slug: {
        type: String,
        unique: [true, "Slug must be unique."],
        required: [true, "Slug is required."],
    },
}, {timestamps: true});

export default GenreSchema;