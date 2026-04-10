/**
 * @file Type definitions for User persistence models.
 * @filename User.types.ts
 */

import {Types} from "mongoose";
import type {UserRole, UserUniqueCode} from "@domains/users/validation";

/**
 * Represents the full shape of a User document as stored in MongoDB.
 * ---
 */
export interface UserSchemaFields {
    /** Unique MongoDB identifier. */
    readonly _id: Types.ObjectId;

    /** The user's full display name. */
    name: string;

    /** Primary contact and login identifier. Unique at the database level. */
    email: string;

    /** Hashed credential string. Never expose this in API responses. */
    password: string;

    /** * Standardized system-generated identifier.
     * @see {@link UserUniqueCode} for format specifications.
     */
    uniqueCode: UserUniqueCode;

    /** List of access levels (e.g., 'User', 'Admin') assigned to the account. */
    roles: UserRole[];

    /** Collection of Movie ObjectIDs flagged as favorites by the user. */
    favourites: Types.ObjectId[];
}

/**
 * A lightweight version of the User fields, containing only public identity data.
 * ---
 */
export type LeanUserSchemaFields = Omit<UserSchemaFields, "password" | "roles" | "favourites">;