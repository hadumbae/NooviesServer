/**
 * @fileoverview Service function handling the lifting of a user suspension and logging the corresponding event.
 */

import {Types} from "mongoose";
import createHttpError from "http-errors";
import {type UserModerationLogSchemaFields} from "@/domains/users/model/moderation-log";
import {User, type UserSchemaFields,} from "@/domains/users/model/user";
import {LeanUserQuerySelectFields} from "@/domains/users/_feat/query-population";
import {saveUserModerationLog} from "@/domains/users/_feat/user-moderation";
import {
    type UserSuspensionUpdateAction,
    type UserSuspensionUpdateInputData
} from "@/domains/users/_feat/manage-user-suspension/schema";

/** Configuration parameters required to lift a user suspension. */
type LiftSuspensionConfig = {
    adminID: Types.ObjectId;
    userID: Types.ObjectId;
    data: UserSuspensionUpdateInputData;
};

/** The reactivated user details and the created moderation log entry. */
type LiftSuspensionReturns = {
    user: UserSchemaFields;
    log: UserModerationLogSchemaFields;
};

/**
 * Reverts a user's status from suspended to active and creates an associated record in the moderation log history.
 */
export async function liftUserSuspension(
    {adminID, userID, data: {action, message}}: LiftSuspensionConfig
): Promise<LiftSuspensionReturns> {
    const user = await User
        .findOne({_id: userID, status: "SUSPENDED"})
        .select(LeanUserQuerySelectFields);

    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    user.status = "ACTIVE";
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