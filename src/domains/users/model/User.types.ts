/**
 * @file User.types.ts
 * Type definitions for User persistence models.
 */

import {Types} from "mongoose";
import type {UserRole} from "../schema/enum/UserRoleEnumSchema.js";

/**
 * User document shape as stored in the database.
 */
export interface UserSchemaFields {
    readonly _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    roles: UserRole[];
    favourites: Types.ObjectId[];
}
