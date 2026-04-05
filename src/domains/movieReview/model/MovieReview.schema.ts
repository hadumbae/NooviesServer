/**
 * @file Mongoose schema definition for the MovieReview collection.
 * @filename MovieReview.schema.ts
 */

import {Schema} from "mongoose";
import type {MovieReviewSchemaFields} from "./MovieReview.types.js";
import {
    MovieReviewModerationLogSchema
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.schema";
import SlugSchemaTypeOptions from "@shared/model/SlugSchemaTypeOptions";

/**
 * Mongoose schema for storing and validating user-submitted movie reviews.
 * ---
 */
export const MovieReviewSchema = new Schema<MovieReviewSchemaFields>({
    /** Reference to the User who authored the review. */
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        immutable: true,
        required: [true, "Required."],
    },

    /** Publicly visible name of the reviewer at the time of posting. */
    displayName: {
        type: String,
        maxlength: [100, "Must be 100 characters or less."],
        required: [true, "Required."],
    },

    /** Reference to the Movie being reviewed. */
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        immutable: true,
        required: [true, "Required."],
    },

    /** Brief headline summarizing the user's opinion. */
    summary: {
        type: String,
        maxlength: [500, "Must be 500 characters or less."],
        required: [true, "Required."],
    },

    /** Detailed body text of the review. */
    reviewText: {
        type: String,
        maxlength: [2000, "Must be 2000 characters or less."],
    },

    /** Numeric score assigned to the movie (1-5 scale). */
    rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: Number.isInteger,
        required: [true, "Required."],
    },

    /** Flag indicating whether the reviewer suggests others watch the movie. */
    isRecommended: {
        type: Boolean,
        default: false,
    },

    /** List of User IDs who found this review helpful. */
    helpfulLikes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },

    /** Visibility toggle for public rendering or moderation. */
    isPublic: {
        type: Boolean,
        default: true,
    },

    /** Nested array of administrative interventions and history. */
    moderationLogs: {
        type: [MovieReviewModerationLogSchema],
        default: [],
    },

    /** URL-friendly identifier for SEO and routing. */
    slug: SlugSchemaTypeOptions,

    /** Human-readable tracking code (e.g., REV-XXXXX-XXXXX). */
    uniqueCode: {
        type: String,
        match: [
            /^REV-[A-Z0-9]{5}-[A-Z0-9]{5}$/,
            'Invalid format. Expected REV-XXXXX-XXXXX (e.g., REV-K9P2W-LM4X1)'
        ],
        unique: [true, "Unique code must be unique."],
        required: [true, "Unique Code is required."],
        trim: true,
    }
}, {timestamps: true});