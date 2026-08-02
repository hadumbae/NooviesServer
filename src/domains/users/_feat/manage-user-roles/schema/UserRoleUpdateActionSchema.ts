/**
 * @fileoverview Validation schemas and types for user role update actions extracted from general moderation capabilities.
 */

import {z} from "zod";
import {UserRoleUpdateActionConstant} from "@/domains/users/_feat/manage-user-roles/const";
import {UserModerationLogActionSchema} from "@/domains/users/validation/fields/moderation";

/** Zod schema validating subset actions specifically authorised for changing user roles. */
export const UserRoleUpdateActionSchema = UserModerationLogActionSchema.extract(UserRoleUpdateActionConstant);

/** TypeScript type inferred from the UserRoleUpdateActionSchema. */
export type UserRoleUpdateAction = z.infer<typeof UserRoleUpdateActionSchema>;