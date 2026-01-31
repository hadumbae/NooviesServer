/**
 * @file MovieSnapshot.schema.ts
 *
 * Mongoose schema defining an immutable snapshot of a movie.
 *
 * A movie snapshot represents the resolved state of a movie at a specific
 * point in time and is embedded into other entities such as showings and
 * reservations to preserve historical accuracy.
 *
 * Snapshot data must remain valid even if the source movie is later edited
 * or deleted.
 */

import { Schema } from "mongoose";
import ISO3166Alpha2CodeConstant from "../../../../shared/constants/country/ISO3166Alpha2CodeConstant.js";
import type { MovieSnapshotSchemaFields } from "./MovieSnapshot.types.js";
import { URLStringSchema } from "../../../../shared/schema/strings/URLStringSchema.js";

/**
 * Mongoose schema for movie snapshot persistence.
 *
 * @remarks
 * This schema is write-once by convention and must not be mutated after
 * being embedded into a parent document.
 */
export const MovieSnapshotSchema = new Schema<MovieSnapshotSchemaFields>({
    /** Localized display title of the movie. */
    title: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [250, "Must be 250 characters or less."],
        trim: true,
        required: [true, "Required."],
    },

    /** Original release title of the movie. */
    originalTitle: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [250, "Must be 250 characters or less."],
        trim: true,
    },

    /** Optional marketing tagline. */
    tagline: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [100, "Must be 100 characters or less."],
    },

    /** Optional poster image URL. */
    posterURL: {
        type: String,
        validate: {
            message: "Poster URL must be a valid URL.",
            validator: (posterURL) => {
                if (!posterURL) return true;
                const { success } = URLStringSchema.safeParse(posterURL);
                return success;
            },
        },
    },

    /**
     * List of genre labels associated with the movie.
     *
     * @remarks
     * Must contain unique values.
     */
    genres: {
        type: [String],
        required: [true, "Genres are required."],
        validate: {
            validator: (arr) => Array.isArray(arr) && new Set(arr).size === arr.length,
            message: "Genres must be unique.",
        },
    },

    /** Original release date of the movie, if known. */
    releaseDate: {
        type: Date,
    },

    /** Runtime in minutes. */
    runtime: {
        type: Number,
        min: [1, "Must be at least 1 minute."],
        max: [500, "Must be 500 minutes or less."],
        required: [true, "Duration in minutes is required."],
    },

    /** Production country (ISO 3166-1 alpha-2). */
    country: {
        type: String,
        required: [true, "Country is required."],
        enum: {
            values: ISO3166Alpha2CodeConstant,
            message: "Invalid ISO 3166-1 Alpha-2 Code.",
        },
    },
});
