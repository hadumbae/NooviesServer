/**
 * @fileoverview Defines the Mongoose model for movie review moderation audit entries.
 *
 */

import {model, type Model} from "mongoose"
import type {
    MovieReviewModerationLogSchemaFields
} from "@/domains/movie-reviews/_models/moderationLogs/MovieReviewModerationLog.types"
import {
    MovieReviewModerationLogSchema
} from "@/domains/movie-reviews/_models/moderationLogs/MovieReviewModerationLog.schema"

/**
 * Mongoose model for interacting with the movie review moderation logs collection.
 */
export const MovieReviewModerationLog: Model<MovieReviewModerationLogSchemaFields> =
    model<MovieReviewModerationLogSchemaFields>("MovieReviewModerationLog", MovieReviewModerationLogSchema)