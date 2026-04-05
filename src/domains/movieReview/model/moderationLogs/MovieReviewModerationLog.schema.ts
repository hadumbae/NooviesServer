/**
 * @file Mongoose schema definition for Movie Review moderation logs.
 * @filename MovieReviewModerationLog.schema.ts
 */

import {Schema} from "mongoose";
import {MovieReviewModerationActionConstant} from "@domains/movieReview/validation/moderation-actions/constant";
import type {
    MovieReviewModerationLogSchemaFields
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.types";

/**
 * Mongoose schema for tracking administrative interventions on movie reviews.
 * ---
 */
export const MovieReviewModerationLogSchema = new Schema<MovieReviewModerationLogSchemaFields>({
    /** The categorization of the administrative action taken. */
    action: {
        type: String,
        enum: {
            values: MovieReviewModerationActionConstant,
            message: "Invalid action type.",
        },
        required: [true, "Action is required."],
    },

    /** Reference to the Administrator (User) who executed the command. */
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The admin is required."],
    },

    /** The timestamp of the moderation event. Defaults to the current date. */
    modDate: {
        type: Date,
        default: Date.now,
    },

    /** A descriptive reason or note regarding the moderation event. */
    message: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [500, "Must be 500 characters or less."],
        required: [true, "Message is required."],
    },
});