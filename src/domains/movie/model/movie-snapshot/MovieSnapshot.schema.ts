/**
 * @file MovieSnapshotSchema.ts
 *
 * @summary
 * Mongoose schema for a movie snapshot, representing a movie's state
 * at a given point in time for use in showings, reservations, etc.
 */

import { Schema } from "mongoose";
import ISO3166Alpha2CodeConstant from "../../../../shared/constants/country/ISO3166Alpha2CodeConstant.js";
import type { MovieSnapshotSchemaFields } from "./MovieSnapshot.types.js";
import { URLStringSchema } from "../../../../shared/schema/strings/URLStringSchema.js";

/**
 * Mongoose schema defining the structure and validation for a movie snapshot.
 *
 * Fields:
 * - `title`: Movie title (required, 1–250 characters)
 * - `originalTitle`: Original movie title (optional, 1–250 characters)
 * - `tagline`: Optional tagline (1–100 characters)
 * - `posterURL`: Optional URL to movie poster (must be valid URL if present)
 * - `genres`: Required array of unique genre strings
 * - `releaseDate`: Optional release date
 * - `runtime`: Required duration in minutes (1–500)
 * - `country`: Required ISO 3166-1 alpha-2 country code
 */
export const MovieSnapshotSchema = new Schema<MovieSnapshotSchemaFields>({
    title: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [250, "Must be 250 characters or less."],
        trim: true,
        required: [true, "Required."],
    },
    originalTitle: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [250, "Must be 250 characters or less."],
        trim: true,
    },
    tagline: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [100, "Must be 100 characters or less."],
    },
    posterURL: {
        type: String,
        validate: {
            message: "Poster URL must be a valid URL.",
            validator: (posterURL) => {
                const { success } = URLStringSchema.safeParse(posterURL);
                return success;
            },
        },
    },
    genres: {
        type: [String],
        required: [true, "Genres are required."],
        validate: {
            validator: (arr) => Array.isArray(arr) && new Set(arr).size === arr.length,
            message: "Genres must be unique.",
        },
    },
    releaseDate: {
        type: Date,
    },
    runtime: {
        type: Number,
        min: [1, "Must be at least 1 minute."],
        max: [500, "Must be 500 minutes or less."],
        required: [true, "Duration in minutes is required."],
    },
    country: {
        type: String,
        required: [true, "Country is required."],
        enum: { values: ISO3166Alpha2CodeConstant, message: "Invalid ISO 3166-1 Alpha-2 Code." },
    },
});
