import {Schema} from "mongoose";
import type {GenreSchemaFields} from "./Genre.types.js";
import {CloudinaryImageSchema} from "../../../shared/model/cloudinary-image/CloudinaryImage.js";

/**
 * Genre mongoose schema.
 *
 * @remarks
 * - Enforces uniqueness and validation for genre fields
 * - Includes timestamps and slug indexing
 */
const GenreSchema = new Schema<GenreSchemaFields>({
    /** Unique display name of the genre. */
    name: {
        type: String,
        required: [true, "Name is required."],
        unique: [true, "Name must be unique."],
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
    },

    /** Descriptive text for the genre. */
    description: {
        type: String,
        required: [true, "Description is required."],
        maxlength: [1000, "Description must be 1000 characters or less."],
    },

    /** Associated Cloudinary image. */
    image: {
        type: CloudinaryImageSchema,
        default: null,
    },

    /** URL-friendly identifier. */
    slug: {
        type: String,
        unique: [true, "Slug must be unique."],
        required: [true, "Slug is required."],
    },
}, {timestamps: true});

export default GenreSchema;
