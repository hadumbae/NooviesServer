/**
 * @fileoverview Service function for updating a user's suspension status and recording a moderation log.
 */

import {Types} from "mongoose";
import createHttpError from "http-errors";
import type {UserStatus} from "@/domains/users/validation/fields";
import {type UserModerationLogSchemaFields} from "@/domains/users/model/moderation-log";
import {User, type UserSchemaFields,} from "@/domains/users/model/user";
import {LeanUserQuerySelectFields} from "@/domains/users/_feat/query-population";
import {saveUserModerationLog} from "@/domains/users/_feat/user-moderation";
import {
    type UserSuspensionUpdateAction,
    type UserSuspensionUpdateInputData
} from "@/domains/users/_feat/manage-user-suspension/schema";

/** Configuration options required to update a user's suspension status. */
type SuspensionConfig = {
    adminID: Types.ObjectId;
    userID: Types.ObjectId;
    data: UserSuspensionUpdateInputData;
};

/** Return values containing the updated user document and the associated moderation log record. */
type SuspensionReturns = {
    user: UserSchemaFields;
    log: UserModerationLogSchemaFields;
};

/**
 * Updates the suspension status of a user and creates a moderation log entry.
 */
export async function updateUserSuspension(
    {adminID, userID, data: {suspend, action, message}}: SuspensionConfig
): Promise<SuspensionReturns> {
    const [fromStatus, toStatus]: [UserStatus, UserStatus] = suspend
        ? ["ACTIVE", "SUSPENDED"]
        : ["SUSPENDED", "ACTIVE"];

    const user = await User
        .findOne({_id: userID, status: fromStatus})
        .select(LeanUserQuerySelectFields);

    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    user.status = toStatus;
    await user.save();

    const log = await saveUserModerationLog<UserSuspensionUpdateAction>({
        user: userID,
        admin: adminID,
        message,
        action,
    })

    return {
        user,
        log,
    }
}