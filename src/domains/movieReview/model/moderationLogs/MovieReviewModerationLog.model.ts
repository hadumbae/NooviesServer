/**
 * @file Mongoose model for individual Movie Review moderation audit entries.
 * @filename MovieReviewModerationLog.model.ts
 */

import {model, type Model} from "mongoose";
import type {
    MovieReviewModerationLogSchemaFields
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.types";
import {
    MovieReviewModerationLogSchema
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.schema";

/**
 * Model constructor for MovieReviewModerationLog documents.
 * ---
 */
export const MovieReviewModerationLog: Model<MovieReviewModerationLogSchemaFields> =
    model<MovieReviewModerationLogSchemaFields>("MovieReviewModerationLog", MovieReviewModerationLogSchema);