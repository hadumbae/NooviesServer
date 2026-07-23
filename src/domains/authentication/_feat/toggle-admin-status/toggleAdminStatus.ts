/**
 * @fileoverview Functionality to grant or revoke administrative privileges for a user.
 */

import {Types} from "mongoose";
import {User, type UserSchemaFields} from "@/domains/users/model/user";
import createHttpError from "http-errors";

/** Toggles the ADMIN role on a user document and persists the change. */
export async function toggleAdminStatus(userID: Types.ObjectId): Promise<UserSchemaFields> {
    const user = await User.findById(userID);
    if (!user) throw createHttpError(404, "User not found!");

    const {roles} = user;

    if (roles.includes("ADMIN")) {
        user.roles = roles.filter((r) => r !== "ADMIN");
    } else {
        user.roles = [...roles, "ADMIN"];
    }

    return user.save();
}