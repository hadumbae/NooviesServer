/**
 * @fileoverview Service function handling user suspension updates and logging corresponding moderation events.
 */

import {Types} from "mongoose";
import createHttpError from "http-errors";
import {type UserModerationLogSchemaFields} from "@/domains/users/model/moderation-log";
import {User, type UserSchemaFields,} from "@/domains/users/model/user";
import {LeanUserQuerySelectFields} from "@/domains/users/_feat/query-population";
import {type UserSuspensionUpdateInputData} from "@/domains/users/_feat/manage-user-suspension/schema";
import {
    saveUserSuspensionUpdateModerationLog
} from "@/domains/users/_feat/manage-user-suspension/service/saveUserSuspensionUpdateModerationLog";

/** Configuration parameters required to suspend a user. */
type SuspendUserConfig = {
    adminID: Types.ObjectId;
    userID: Types.ObjectId;
    data: UserSuspensionUpdateInputData;
};

/** The modified user details and the created moderation log entry. */
type SuspendUserReturns = {
    user: UserSchemaFields;
    log: UserModerationLogSchemaFields;
};

/**
 * Updates a user's status to suspended and creates a corresponding record in the moderation log history.
 */
export async function suspendUser(
    {adminID, userID, data: {action, message}}: SuspendUserConfig
): Promise<SuspendUserReturns> {
    const user = await User.findById(userID).select(LeanUserQuerySelectFields);
    if (!user) throw createHttpError(404, "User not found!");

    user.status = "SUSPENDED";
    await user.save();

    const log = await saveUserSuspensionUpdateModerationLog({
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