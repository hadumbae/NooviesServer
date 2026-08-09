/**
 * @fileoverview Service function for managing user administrative roles and logging moderation events.
 */

import {Types} from "mongoose";
import createHttpError from "http-errors";
import {User, type UserModerationLogSchemaFields, type UserSchemaFields} from "@/domains/users/model";
import {saveUserModerationLog,} from "@/domains/users/_feat/user-moderation";
import {LeanUserQuerySelectFields,} from "@/domains/users/_feat/query-population";
import {type UserRoleUpdateAction, type UserAdminRoleUpdateInputData} from "@/domains/users/_feat/manage-user-roles/schema";

/** Configuration options required to update a user's administrative roles. */
type RoleConfig = {
    userId: Types.ObjectId;
    adminId: Types.ObjectId;
    data: UserAdminRoleUpdateInputData;
}

/** Return values containing the updated user document and the associated moderation log record. */
type RoleReturns = {
    user: UserSchemaFields;
    log: UserModerationLogSchemaFields;
};

/**
 * Updates a user's role assignments and creates a corresponding moderation log entry.
 */
export async function manageUserAdminRole(
    {userId, adminId, data: {roles, message, action}}: RoleConfig
): Promise<RoleReturns> {
    const user = await User
        .findById(userId)
        .select(LeanUserQuerySelectFields);

    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    user.roles = roles;
    await user.save();

    const log = await saveUserModerationLog<UserRoleUpdateAction>({
        admin: adminId,
        user: userId,
        action,
        message,
    });

    return {
        user,
        log,
    }
}