/**
 * @fileoverview Validation schemas and types for user suspension status input data.
 */

import {z} from "zod";
import {BooleanValueSchema} from "@/shared/_schema/booleans/BooleanValueSchema";
import {UserModerationLogInputSchema} from "@/domains/users/_feat/user-moderation";
import {
    UserSuspensionUpdateActionSchema
} from "@/domains/users/_feat/manage-user-suspension/schema/UserSuspensionUpdateActionSchema";

/** Zod schema validating the input object data required to update a user's suspension state. */
export const UserSuspensionUpdateInputSchema = UserModerationLogInputSchema.omit({action: true}).extend({
    action: UserSuspensionUpdateActionSchema,
    suspend: BooleanValueSchema,
});

/** TypeScript type inferred from the UserSuspensionUpdateInputSchema. */
export type UserSuspensionUpdateInputData = z.infer<typeof UserSuspensionUpdateInputSchema>;