/**
 * @fileoverview Validation schemas and types for user suspension status input data.
 */

import {UserModerationLogInputSchema, UserSuspensionUpdateActionSchema} from "@/domains/users";
import {BooleanValueSchema} from "@/shared/_schema/booleans/BooleanValueSchema";
import {z} from "zod";

/** Zod schema validating the input object data required to update a user's suspension state. */
export const UserSuspensionUpdateInputSchema = UserModerationLogInputSchema.omit({action: true}).extend({
    action: UserSuspensionUpdateActionSchema,
    suspend: BooleanValueSchema,
});

/** TypeScript type inferred from the UserSuspensionUpdateInputSchema. */
export type UserSuspensionUpdateInputData = z.infer<typeof UserSuspensionUpdateInputSchema>;