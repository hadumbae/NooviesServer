/**
 * @fileoverview Service function handling user administrative role updates and logging corresponding moderation events.
 */

import {Types} from "mongoose";
import createHttpError from "http-errors";
import {User, type UserModerationLogSchemaFields, type UserSchemaFields} from "@/domains/users/model";
import {saveUserModerationLog,} from "@/domains/users/_feat/user-moderation";
import {type UserRole} from "@/domains/users/validation";
import {LeanUserQuerySelectFields,} from "@/domains/users/_feat/query-population";
import {type UserRoleUpdateAction, type UserRoleUpdateInputData} from "@/domains/users/_feat/manage-user-roles/schema";

/** Configuration parameters required to alter a user's administrative roles. */
type RoleConfig = {
    userId: Types.ObjectId;
    adminId: Types.ObjectId;
    data: UserRoleUpdateInputData;
    grantAdmin: boolean;
}

/** The updated user details and the created role adjustment moderation log entry. */
type RoleReturns = {
    user: UserSchemaFields;
    log: UserModerationLogSchemaFields;
};

/**
 * Modifies a user's role assignments, handles administrative privilege toggles, and logs the moderation history.
 */
export async function manageUserAdminRole(
    {userId, adminId, grantAdmin, data: {roles, message, action}}: RoleConfig
): Promise<RoleReturns> {
    const user = await User
        .findById(userId)
        .select(LeanUserQuerySelectFields);

    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    const uniqueRoles = new Set([...user.roles, ...roles].filter(r => r !== "USER" && r !== "ADMIN"));
    user.roles = [...uniqueRoles, ...(grantAdmin ? ["USER", "ADMIN"] : ["USER"])] as UserRole[];

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