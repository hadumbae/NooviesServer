/**
 * @fileoverview Defines the Mongoose schema for user moderation logs.
 */

import {Schema} from "mongoose";
import {UserModerationLogActionConstant, type UserModerationLogSchemaFields} from "@/domains/users";

/** Mongoose schema for the UserModerationLog model. */
export const UserModerationLogSchema = new Schema<UserModerationLogSchemaFields>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."],
        immutable: true,
    },

    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."],
        immutable: true,
    },

    action: {
        type: String,
        enum: {
            values: UserModerationLogActionConstant,
            message: "Invalid action type.",
        },
        required: [true, "Action is required."],
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
}, {timestamps: true});