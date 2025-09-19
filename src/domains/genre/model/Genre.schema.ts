import { Schema } from "mongoose";
import type IGenre from "./Genre.interface.js";

/**
 * Mongoose schema for {@link IGenre}.
 *
 * Defines the structure, validation rules, and database constraints
 * for genre documents.
 *
 * ## Fields
 * - `name` (string, required, unique) – The name of the genre (e.g., "Comedy", "Drama").
 *   Must be unique across all genres, between 1 and 150 characters.
 * - `description` (string, required) – A textual description of the genre.
 *   Maximum length of 1000 characters.
 *
 * ## Indexes
 * - Unique index on `name` to prevent duplicate genre names.
 *
 * ## Timestamps
 * - Automatically adds `createdAt` and `updatedAt` fields.
 */
const GenreSchema = new Schema<IGenre>({
    /**
     * The name of the genre.
     *
     * - Required.
     * - Must be unique.
     * - Minimum length: 1 character.
     * - Maximum length: 150 characters.
     * - Example: "Action", "Comedy".
     */
    name: {
        type: String,
        required: [true, "Name is required."],
        unique: [true, "Name must be unique."],
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
    },

    /**
     * Description of the genre.
     *
     * - Required.
     * - Maximum length: 1000 characters.
     * - Example: "A genre characterized by suspense and excitement."
     */
    description: {
        type: String,
        required: [true, "Description is required."],
        maxlength: [1000, "Description must be 1000 characters or less."],
    },
}, { timestamps: true });

export default GenreSchema;
