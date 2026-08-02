/**
 * @fileoverview Service function handling the database persistence of user suspension moderation log entries.
 */

import {UserModerationLog, type UserModerationLogSchemaFields, type UserSuspensionUpdateAction} from "@/domains/users";
import {Types} from "mongoose";
import type {ModerationLogMessage} from "@/shared/_schema";

/** Configuration parameters required to persist a user suspension moderation log. */
type SaveConfig = {
    admin: Types.ObjectId;
    user: Types.ObjectId;
    action: UserSuspensionUpdateAction;
    message: ModerationLogMessage;
};

/**
 * Creates and records a new user suspension moderation log entry in the database.
 */
export async function saveUserSuspensionUpdateModerationLog(
    {admin, user, action, message}: SaveConfig
): Promise<UserModerationLogSchemaFields> {
    const log = new UserModerationLog({
        admin,
        user,
        modDate: new Date(),
        action,
        message,
    });

    await log.save();

    return log;
}