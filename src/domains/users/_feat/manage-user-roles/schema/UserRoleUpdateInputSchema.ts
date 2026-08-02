/**
 * @fileoverview Validation schemas and types for user role alteration input data payloads.
 */

import {UserModerationLogInputSchema, UserRoleSchema, UserSuspensionUpdateActionSchema} from "@/domains/users";
import {z} from "zod";

/** Zod schema validating input data payloads for modifying user role permissions and requirements. */
export const UserRoleUpdateInputSchema = UserModerationLogInputSchema.omit({action: true}).extend({
    action: UserSuspensionUpdateActionSchema,
    roles: z
        .array(UserRoleSchema, {invalid_type_error: "Must contain at least one role.", required_error: "Required."})
        .refine((roles) => roles.length > 0, {message: "Must define at least one role."})
        .refine((roles) => roles.includes("USER"), {message: "Must include the 'USER' role."}),
});

/** TypeScript type inferred from the UserRoleUpdateInputSchema. */
export type UserRoleUpdateInputData = z.infer<typeof UserRoleUpdateInputSchema>;