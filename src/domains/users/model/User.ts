import { Model, model, Schema } from "mongoose";
import type UserSchemaFields from "./UserSchemaFields.js";
import UserRoleConstant from "../constants/UserRoleConstant.js";

/**
 * Mongoose schema defining the structure and validation for User documents.
 *
 * Includes fields for name, email, password, and roles, with validation rules
 * and custom error messages. Automatically manages `createdAt` and `updatedAt` timestamps.
 *
 * @example
 * ```ts
 * import User from './User.model.js';
 *
 * const newUser = await User.create({
 *   name: "Jane Doe",
 *   email: "jane@example.com",
 *   password: "secureHashedPassword123",
 *   roles: ["USER"]
 * });
 * ```
 */
const UserSchema = new Schema<UserSchemaFields>({
    /** The user's full name. Required. */
    name: {
        type: String,
        required: [true, "Name is required."],
    },

    /** The user's unique email address. Required and must be unique. */
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "Email must be unique."],
    },

    /** The user's hashed password. Required, minimum length of 16 characters. */
    password: {
        type: String,
        required: [true, "Password is required."],
        minLength: [16, "Password must be at least 16 characters."],
    },

    /** Array of roles assigned to the user. Must be non-empty and contain unique valid roles. */
    roles: {
        type: [{
            type: String,
            enum: { values: UserRoleConstant, message: "Must be a valid role." },
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
        required: [true, "`Roles` are required."],
    }
}, { timestamps: true });

/**
 * Mongoose model for User documents.
 *
 * Provides methods for creating, querying, updating, and deleting users
 * in the MongoDB collection.
 */
const User: Model<UserSchemaFields> = model<UserSchemaFields>("User", UserSchema);
export default User;
