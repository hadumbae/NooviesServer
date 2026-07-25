/**
 * @fileoverview Defines the schema structure for user moderation activity logs.
 */

import type {BaseModel} from "@/shared/_types";
import {Types} from "mongoose";
import type {MovieReviewModerationAction} from "@/domains/movie-reviews";
import type {AdminModerationMessage} from "@/shared/_feat/admin-users/schema";

/** Represents the database schema fields for a user moderation log entry. */
export type UserModerationLogSchemaFields = BaseModel & {
    action: MovieReviewModerationAction;
    user: Types.ObjectId;
    admin: Types.ObjectId;
    modDate: Date;
    message: AdminModerationMessage;
};