/**
 * @fileoverview Validation schemas and type definitions for updating user administrative roles.
 */

import {z} from "zod";
import {UserRoleSchema} from "@/domains/users/validation/fields";
import {UserModerationLogInputSchema} from "@/domains/users/_feat/user-moderation";
import {UserRoleUpdateActionSchema} from "@/domains/users/_feat/manage-user-roles/schema/UserRoleUpdateActionSchema";

const BaseSchema = UserModerationLogInputSchema.omit({action: true});

const RoleArray = z
    .array(UserRoleSchema, {invalid_type_error: "Must contain at least one role.", required_error: "Required."})
    .refine((roles) => roles.includes("USER"), {message: "Must include the 'USER' role."})
    .transform((roles) => [...(new Set(roles))]);

const GrantSchema = BaseSchema.extend({
    action: UserRoleUpdateActionSchema.extract(["user_role_grant_admin"]),
    roles: RoleArray
        .refine((roles) => roles.includes("ADMIN"), {message: "Must include the 'ADMIN' role."})
});

const RevokeSchema = BaseSchema.extend({
    action: UserRoleUpdateActionSchema.extract(["user_role_revoke_admin"]),
    roles: RoleArray
        .refine((roles) => !roles.includes("ADMIN"), {message: "Must not include the 'ADMIN' role."}),
});

/** Discriminated union schema validating user admin role update operations. */
export const UserAdminRoleUpdateInputSchema = z.discriminatedUnion("action", [GrantSchema, RevokeSchema]);

/** Input data type inferred from UserAdminRoleUpdateInputSchema. */
export type UserAdminRoleUpdateInputData = z.infer<typeof UserAdminRoleUpdateInputSchema>;