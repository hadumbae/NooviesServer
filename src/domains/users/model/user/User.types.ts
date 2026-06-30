/**
 * @fileoverview Type definitions for User persistence models.
 */

import {Types} from "mongoose";
import type {UserRole, UserUniqueCode} from "@/domains/users/_feat/manage-user-unique-code/schemas";

/** Represents the full shape of a User document as stored in MongoDB. */
export type UserSchemaFields = {
    readonly _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    uniqueCode: UserUniqueCode;
    roles: UserRole[];
    favourites: Types.ObjectId[];
}
/** A lightweight version of the User fields containing only public identity data. */
export type LeanUserSchemaFields = Omit<
    UserSchemaFields,
    "password" | "roles" | "favourites"
>;