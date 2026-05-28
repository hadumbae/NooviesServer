/**
 * @fileoverview Mongoose schema definition for the MovieReview collection.
 *
 */

import {Schema} from "mongoose";
import type {MovieReviewSchemaFields} from "@domains/movieReview/model/model/MovieReview.types.js";
import SlugSchemaTypeOptions from "@shared/model/SlugSchemaTypeOptions";

/** Mongoose schema for storing and validating user-submitted movie reviews. */
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
    },

    isPublic: {
        type: Boolean,
        default: true,
    },

    slug: SlugSchemaTypeOptions,

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