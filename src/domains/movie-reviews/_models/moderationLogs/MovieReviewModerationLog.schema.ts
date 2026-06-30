/**
 * @fileoverview Defines the Mongoose schema for movie review moderation logs.
 *
 */

import {Schema} from "mongoose"
import {MovieReviewModerationActionConstant} from "@/domains/movie-reviews/_validation/moderation-actions/constant"
import type {
    MovieReviewModerationLogSchemaFields
} from "@/domains/movie-reviews/_models/moderationLogs/MovieReviewModerationLog.types"

/**
 * Mongoose schema for tracking administrative interventions on movie reviews.
 */
export const MovieReviewModerationLogSchema = new Schema<MovieReviewModerationLogSchemaFields>({
    review: {
        type: Schema.Types.ObjectId,
        ref: "MovieReview",
        required: [true, "The movie review is required."],
        immutable: true,
    },

    action: {
        type: String,
        enum: {
            values: MovieReviewModerationActionConstant,
            message: "Invalid action type.",
        },
        required: [true, "Action is required."],
        immutable: true,
    },

    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The admin is required."],
        immutable: true,
    },

    modDate: {
        type: Date,
        default: Date.now,
        immutable: true,
    },

    message: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [500, "Must be 500 characters or less."],
        required: [true, "Message is required."],
        immutable: true,
    },
})