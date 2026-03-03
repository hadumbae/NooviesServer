/**
 * @file MovieReview Mongoose schema definition.
 * MovieReview.schema.ts
 */

import {Schema} from "mongoose";
import type {MovieReviewSchemaFields} from "./MovieReview.types.js";

/**
 * Schema for storing user-submitted movie reviews.
 */
export const MovieReviewSchema = new Schema<MovieReviewSchemaFields>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        immutable: true,
        required: [true, "Required."],
    },

    displayName: {
        type: String,
        maxlength: [100, "Must be 100 characters or less."],
        required: [true, "Required."],
    },

    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        immutable: true,
        required: [true, "Required."],
    },

    summary: {
        type: String,
        maxlength: [500, "Must be 500 characters or less."],
        required: [true, "Required."],
    },

    reviewText: {
        type: String,
        maxlength: [2000, "Must be 2000 characters or less."],
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: Number.isInteger,
        required: [true, "Required."],
    },

    isRecommended: {
        type: Boolean,
        default: false,
    },

    helpfulLikes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    }
});