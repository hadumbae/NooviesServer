/**
 * @fileoverview Zod schema and type definition for user status update action values.
 */

import {UserModerationLogActionSchema} from "@/domains/users/validation/fields";
import {UserStatusUpdateActionConstant} from "@/domains/users/_feat/manage-user-status/const";
import {z} from "zod";

/** Zod schema for validating permitted user status update actions extracted from moderation log actions. */
export const UserStatusUpdateActionSchema = UserModerationLogActionSchema.extract(UserStatusUpdateActionConstant);

/** Permitted user status update actions inferred from UserStatusUpdateActionSchema. */
export type UserStatusUpdateAction = z.infer<typeof UserStatusUpdateActionSchema>;