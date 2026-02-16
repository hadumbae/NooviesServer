/**
 * @file User.schema.ts
 * Defines the Mongoose schema for persisted user documents.
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
                if (!Array.isArray(arr) || arr.length === 0) return false;
                return new Set(arr).size === arr.length;
            },
        },
        default: ["USER"],
        required: [true, "`Roles` are required."],
    },

    favourites: {
        type: [{type: Schema.Types.ObjectId, ref: "Movies"}],
        required: [true, "Favourites is required."],
        validate: {
            message: "Favourites must have unique elements.",
            validator: (arr) => {
                if (!Array.isArray(arr)) return false;
                const mapped = arr.map((_id) => _id._id ? _id._id.toString() : _id.toString());
                return new Set(mapped).size === arr.length;
            },
        }
    },
}, {timestamps: true});
