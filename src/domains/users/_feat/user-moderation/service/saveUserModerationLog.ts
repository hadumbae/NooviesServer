/**
 * @fileoverview Service function handling the database persistence of general user moderation log entries.
 */

import {Types} from "mongoose";
import type {ModerationLogMessage} from "@/shared/_schema";
import {type UserModerationLogAction} from "@/domains/users/validation/fields";
import {UserModerationLog, type UserModerationLogSchemaFields} from "@/domains/users/model";

/** Configuration parameters required to persist a user moderation log. */
type SaveConfig<TAction extends string = UserModerationLogAction> = {
    admin: Types.ObjectId;
    user: Types.ObjectId;
    action: TAction;
    message: ModerationLogMessage;
};

/**
 * Creates and records a new user moderation log entry in the database.
 */
export async function saveUserModerationLog<TAction extends string = UserModerationLogAction>(
    {admin, user, action, message}: SaveConfig<TAction>
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