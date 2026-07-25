/**
 * @fileoverview Defines the Mongoose model for user moderation logs.
 */

import {model, type Model} from "mongoose";
import type {UserModerationLogSchemaFields} from "@/domains/users";
import {UserModerationLogSchema} from "@/domains/users/model/moderation-log/UserModerationLog.schema";

/**
 * Mongoose model for persisting and querying user moderation log entries.
 */
export const UserModerationLog: Model<UserModerationLogSchemaFields> =
    model<UserModerationLogSchemaFields>("UserModerationLog", UserModerationLogSchema);