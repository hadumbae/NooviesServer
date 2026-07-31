/**
 * @fileoverview Defines the schema structure for user moderation activity logs.
 */

import type {BaseModel} from "@/shared/_types";
import {Types} from "mongoose";
import type {AdminModerationMessage} from "@/shared/_feat/admin-users/schema";
import type {UserModerationLogAction} from "@/domains/users";

/** Represents the database schema fields for a user moderation log entry. */
export type UserModerationLogSchemaFields = BaseModel & {
    action: UserModerationLogAction;
    user: Types.ObjectId;
    admin: Types.ObjectId;
    modDate: Date;
    message: AdminModerationMessage;
};