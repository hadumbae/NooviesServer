/**
 * @fileoverview Zod schema and type definition for validating user status update input data.
 */

import {z} from "zod";
import {UserStatusSchema} from "@/domains/users/validation/fields";
import {UserModerationLogInputSchema} from "@/domains/users/_feat/user-moderation";
import {
    UserStatusUpdateActionSchema
} from "@/domains/users/_feat/manage-user-status/schema/UserStatusUpdateActionSchema";

/** Zod schema for validating input payload when updating user status. */
const BaseSchema = UserModerationLogInputSchema.pick({message: true});

const ActivateOption = BaseSchema.extend({
    action: UserStatusUpdateActionSchema.extract(["user_account_activated"]),
    status: UserStatusSchema.extract(["ACTIVE", "SUSPENDED"])
});

const DeactivateOption = BaseSchema.extend({
    action: UserStatusUpdateActionSchema.extract(["user_account_deactivated"]),
    status: UserStatusSchema.extract(["INACTIVE"])
});

export const UserStatusUpdateInputSchema = z.discriminatedUnion("action", [ActivateOption, DeactivateOption]);

export type UserStatusUpdateInputData = z.infer<typeof UserStatusUpdateInputSchema>;