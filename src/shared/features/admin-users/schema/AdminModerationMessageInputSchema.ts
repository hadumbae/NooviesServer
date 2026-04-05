/**
 * @file Zod validation schema for wrapping administrative moderation messages in a structured object.
 * @filename AdminModerationMessageInputSchema.ts
 */

import {z} from "zod";
import {AdminModerationMessageSchema} from "@shared/features/admin-users/schema/AdminModerationMessageSchema";

/**
 * Object-wrapped schema for moderation message inputs.
 * ---
 */
export const AdminModerationMessageInputSchema = z.object({
    /** The justification or audit note provided by the administrator. */
    message: AdminModerationMessageSchema,
});

/**
 * TypeScript type inferred from {@link AdminModerationMessageInputSchema}.
 * Used for typed request bodies in administrative moderation controllers.
 */
export type AdminModerationMessageInputData = z.infer<typeof AdminModerationMessageInputSchema>;