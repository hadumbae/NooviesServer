/**
 * @fileoverview Validation schemas and types for user suspension update actions extracted from general moderation capabilities.
 */

import {z} from "zod";
import {UserSuspensionUpdateActionConstant} from "@/domains/users/_const";
import {
    UserModerationLogActionSchema
} from "@/domains/users/validation/fields/moderation/UserModerationLogActionSchema";

/** Zod schema validating subset actions specifically authorised for changing user suspension states. */
export const UserSuspensionUpdateActionSchema = UserModerationLogActionSchema.extract(UserSuspensionUpdateActionConstant);

/** TypeScript type inferred from the UserSuspensionUpdateActionSchema. */
export type UserSuspensionUpdateAction = z.infer<typeof UserSuspensionUpdateActionSchema>;