/**
 * @fileoverview Defines the TypeScript interface for Movie Review moderation
 * audit logs, used to track administrative actions taken on reviews.
 */

import type {
    MovieReviewModerationAction
} from "@domains/movieReview/validation/moderation-actions/MovieReviewModerationActionSchema"
import {Types} from "mongoose"
import type {AdminModerationMessage} from "@shared/_feat/admin-users/schema"

export type MovieReviewModerationLogSchemaFields = {
    review: Types.ObjectId
    action: MovieReviewModerationAction
    admin: Types.ObjectId
    message: AdminModerationMessage
    modDate: Date
}