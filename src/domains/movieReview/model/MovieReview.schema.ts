/**
 * @file Mongoose schema definition for the MovieReview collection.
 * @filename MovieReview.schema.ts
 */

import {Schema} from "mongoose";
import type {MovieReviewSchemaFields} from "./MovieReview.types.js";

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
    }
}, {timestamps: true});