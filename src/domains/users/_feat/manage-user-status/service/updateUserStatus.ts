/**
 * @fileoverview Function for updating a user's account status and logging the moderation action.
 */

import {Types} from "mongoose";
import {User, type UserSchemaFields} from "@/domains/users/model/user";
import {LeanUserQuerySelectFields} from "@/domains/users/_feat/query-population";
import createHttpError from "http-errors";
import {saveUserModerationLog, type UserModerationLogSchemaFields} from "@/domains/users";
import type {UserStatusUpdateAction, UserStatusUpdateInputData} from "@/domains/users/_feat/manage-user-status/schema";

/** Parameters required to update a user's account status. */
type UpdateConfig = {
    adminId: Types.ObjectId;
    userId: Types.ObjectId;
    data: UserStatusUpdateInputData;
};

/** Return payload containing the updated user model and created moderation log. */
type UpdateReturns = {
    user: UserSchemaFields;
    log: UserModerationLogSchemaFields;
}

/**
 * Updates the status of a specified user account and records an associated moderation log entry.
 */
export async function updateUserStatus(
    {adminId, userId, data: {action, status, message}}: UpdateConfig
): Promise<UpdateReturns> {
    const user = await User.findById(userId).select(LeanUserQuerySelectFields);
    if (!user) throw createHttpError(404, "User not found!");

    user.status = status;
    await user.save();

    const log = await saveUserModerationLog<UserStatusUpdateAction>({
        admin: adminId,
        user: user._id,
        action,
        message,
    });

    return {
        log,
        user,
    };
}