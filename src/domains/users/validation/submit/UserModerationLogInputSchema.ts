/**
 * @fileoverview Validation schemas and types for user moderation log entry inputs.
 */

import {z} from "zod";
import {UserModerationLogActionSchema} from "@/domains/users";
import {ModerationLogMessageSchema} from "@/shared/_schema";

/** Zod schema validating the input object data required to log a user moderation action. */
export const UserModerationLogInputSchema = z.object({
    action: UserModerationLogActionSchema,
    message: ModerationLogMessageSchema,
});

/** TypeScript type inferred from the UserModerationLogInputSchema. */
export type UserModerationLogInput = z.infer<typeof UserModerationLogInputSchema>;