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

    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        immutable: true,
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

    helpfulVotes: {
        type: Number,
        min: 0,
        default: 0,
        validate: {
            validator: (val) => !val || Number.isInteger(val) && val >= 0,
            message: "Must be a non-negative integer if provided.",
        },
    },
});