/**
 * @fileoverview Functionality to elevate a user's privileges by granting the administrator role.
 */

import {Types} from "mongoose";
import {User, type UserSchemaFields} from "@/domains/users/model/user";
import createHttpError from "http-errors";

/** Updates a user document to include the ADMIN role if it is not already present. */
export async function grantAdminStatus(userID: Types.ObjectId): Promise<UserSchemaFields> {
    const user = await User.findById(userID);
    if (!user) throw createHttpError(404, "User not found!");

    const {roles} = user;

    if (roles.includes("ADMIN")) {
        return user;
    } else {
        user.roles = [...roles, "ADMIN"];
    }

    return user.save();
}