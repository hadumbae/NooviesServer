import { Types } from "mongoose";
import type { UserRole } from "../../users/schema/enum/UserRoleEnumSchema.js";

/**
 * Represents the credentials and basic information of an authenticated user.
 *
 * Typically returned after a successful login.
 *
 * @property user - The unique identifier of the user (`ObjectId`).
 * @property isAdmin - Whether the user has admin privileges.
 * @property name - The full name of the user.
 * @property email - The user's email address.
 * @property token - JWT token for authentication.
 * @property roles - Array of roles assigned to the user.
 *
 * @example
 * ```ts
 * const credentials: UserCredentials = {
 *   user: new Types.ObjectId("64b0f1f1e3b8c3d1f4a2a2b3"),
 *   isAdmin: true,
 *   name: "Jane Doe",
 *   email: "jane@example.com",
 *   token: "jwt.token.here",
 *   roles: ["USER", "ADMIN"]
 * };
 * ```
 */
export type UserCredentials = {
    /** The unique identifier of the user. */
    user: Types.ObjectId;

    /** Whether the user has admin privileges. */
    isAdmin: boolean;

    /** The full name of the user. */
    name: string;

    /** The user's email address. */
    email: string;

    /** JWT token for authentication. */
    token: string;

    /** Array of roles assigned to the user. */
    roles: UserRole[];
};
