/**
 * @fileoverview Mongoose schema definition for the User model.
 */

import {Schema} from "mongoose";
import {UserRoleConstant} from "@/domains/users/_const";
import type {UserSchemaFields} from "@/domains/users/model/user/User.types.js";
import type {UserRole} from "@/domains/users";

/** User document schema. */
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

    uniqueCode: {
        type: String,
        match: [
            /^USR-[A-Z0-9]{5}-[A-Z0-9]{5}$/,
            'Invalid format. Expected USR-XXXXX-XXXXX (e.g., USR-K9P2W-LM4X1)'
        ],
        unique: [true, "Unique code must be unique."],
        required: [true, "Unique Code is required."],
        trim: true,
    },

    roles: {
        type: [{
            type: String,
            enum: {values: UserRoleConstant, message: "Must be a valid role."},
        }],
        validate: [
            {
                validator: (arr: unknown) => Array.isArray(arr) && arr.length > 0 && new Set(arr).size === arr.length,
                message: "Roles must be a non-empty array of unique values.",
            },
            {
                validator: (arr: UserRole[]) => Array.isArray(arr) && arr.includes("USER"),
                message: "Roles must always include the base `USER` role.",
            },
        ],
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

    status: {
        type: String,
        enum: {values: UserRoleConstant, message: "Must be a valid user status."},
        default: "ACTIVE",
        required: [true, "`Status` is required."],
    },
}, {timestamps: true});