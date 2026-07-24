/**
 * @fileoverview Defines types for user authentication credentials and session data.
 */

import {Types} from "mongoose";
import type {UserRole} from "@/domains/users/validation/enum/UserRoleSchema";
import type {UserUniqueCode} from "@/domains/users/_feat/manage-user-unique-code/schemas";

/** Represents the user profile information included in authentication responses. */
type AuthUser = {
    _id: Types.ObjectId;
    name: string;
    email: string;
    roles: UserRole[];
    uniqueCode: UserUniqueCode;
};

/** Data structure containing the authentication token and associated user details. */
export type UserCredentials = {
    token: string;
    isAdmin: boolean;
    user: AuthUser;
};