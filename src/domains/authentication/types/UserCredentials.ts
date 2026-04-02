/**
 * @file Type definition for authenticated user credentials and session data.
 * @filename UserCredentials.ts
 */

import {Types} from "mongoose";
import type {UserRole} from "../../users/schema/enum/UserRoleEnumSchema.js";
import type {UserUniqueCode} from "@domains/users/validation";

/**
 * Represents the core security and identity payload returned upon successful authentication.
 */
export type UserCredentials = {
    /** JWT bearer token used to authorize subsequent API requests. */
    token: string;

    /** * Computed flag derived from {@link UserRole} to simplify high-level
     * administrative UI branching.
     */
    isAdmin: boolean;

    /** Nested identity object containing validated user properties. */
    user: {
        /** Unique MongoDB identifier for the user record. */
        _id: Types.ObjectId;

        /** The user's full display name for UI personalization. */
        name: string;

        /** Primary contact identifier; typically used as the login username. */
        email: string;

        /**
         * Array of specific permissions or access levels assigned to the account.
         * @see {@link UserRole}
         */
        roles: UserRole[];

        /**
         * Standardized alphanumeric system identifier.
         * @see {@link UserUniqueCode}
         */
        uniqueCode: UserUniqueCode;
    }
};