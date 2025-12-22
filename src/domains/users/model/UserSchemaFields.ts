import { Types } from "mongoose";
import type { UserRole } from "../schema/enum/UserRoleEnumSchema.js";

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
export default interface UserSchemaFields {
    /** The unique MongoDB ObjectId for the user. Read-only. */
    readonly _id: Types.ObjectId;

    /** The user's full name. */
    name: string;

    /** The user's email address. Must be unique in the system. */
    email: string;

    /** The user's hashed password. */
    password: string;

    /** Array of roles assigned to the user. Uses values from UserRoleEnumSchema. */
    roles: UserRole[];
}
