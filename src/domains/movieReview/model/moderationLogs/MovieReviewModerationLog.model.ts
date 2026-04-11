/**
 * @fileoverview Defines the Mongoose model for Movie Review moderation audit
 * entries, enabling database operations for moderation logs.
 */

import {model, type Model} from "mongoose"
import type {
    MovieReviewModerationLogSchemaFields
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.types"
import {
    MovieReviewModerationLogSchema
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.schema"

/**
 * Model constructor for MovieReviewModerationLog documents used to interact
 * with the moderation logs collection in MongoDB.
 */
export const MovieReviewModerationLog: Model<MovieReviewModerationLogSchemaFields> =
    model<MovieReviewModerationLogSchemaFields>("MovieReviewModerationLog", MovieReviewModerationLogSchema)