/**
 * @file Defines the Mongoose schema for persisted user documents.
 */

import {Schema} from "mongoose";
import type {UserSchemaFields} from "@models/User.types.js";
import UserRoleConstant from "../constants/UserRoleConstant.js";

/**
 * User document schema.
 */
export const UserSchema = new Schema<UserSchemaFields>({
    name: {
        type: String,
        required: [true, "Name is required."],
    },

    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "Email must be unique."],
    },

    password: {
        type: String,
        required: [true, "Password is required."],
        minLength: [16, "Password must be at least 16 characters."],
    },

    roles: {
        type: [{
            type: String,
            enum: {values: UserRoleConstant, message: "Must be a valid role."},
        }],
        validate: {
            message: "Roles must be a non-array of unique values.",
            validator: (arr: unknown) => {
                if (!Array.isArray(arr) || arr.length === 0) {
                    return false;
                }
                return new Set(arr).size === arr.length;
            },
        },
        default: ["USER"],
        required: [true, "`Roles` are required."],
    }
}, {timestamps: true});
