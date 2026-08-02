/**
 * @fileoverview Validation schemas and types for user role alteration input data payloads.
 */

import {z} from "zod";
import {UserRoleSchema} from "@/domains/users/validation/fields";
import {UserModerationLogInputSchema} from "@/domains/users/_feat/user-moderation";
import {UserRoleUpdateActionSchema} from "@/domains/users/_feat/manage-user-roles/schema/UserRoleUpdateActionSchema";

/** Zod schema validating input data payloads for modifying user role permissions and requirements. */
export const UserRoleUpdateInputSchema = UserModerationLogInputSchema.omit({action: true}).extend({
    action: UserRoleUpdateActionSchema,
    roles: z
        .array(UserRoleSchema, {invalid_type_error: "Must contain at least one role.", required_error: "Required."})
        .refine((roles) => roles.length > 0, {message: "Must define at least one role."})
        .refine((roles) => roles.includes("USER"), {message: "Must include the 'USER' role."})
        .transform((roles) => [...(new Set(roles))]),
});

/** TypeScript type inferred from the UserRoleUpdateInputSchema. */
export type UserRoleUpdateInputData = z.infer<typeof UserRoleUpdateInputSchema>;