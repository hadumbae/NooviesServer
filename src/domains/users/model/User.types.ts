// User.types.ts

import {Types} from "mongoose";
import type {UserRole} from "../schema/enum/UserRoleEnumSchema.js";

/**
 * Interface representing the fields of a User document in the database.
 *
 * @example
 * ```ts
 * const user: UserSchemaFields = {
 *   _id: new Types.ObjectId(),
 *   name: "Jane Doe",
 *   email: "jane@example.com",
 *   password: "hashedPassword123",
 *   roles: ["USER", "ADMIN"]
 * };
 * ```
 */
export interface UserSchemaFields {
    readonly _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    roles: UserRole[];
}
