/**
 * @file Zod validation schema for administrative moderation messages and justifications.
 * @filename AdminModerationMessageSchema.ts
 */

import {z} from "zod";

/**
 * Validates a text-based justification for administrative actions.
 * ---
 */
export const AdminModerationMessageSchema = z
    .string({
        required_error: "Required.",
        invalid_type_error: "Must be a valid string."
    })
    .trim()
    .min(1, "Must not be an empty string.")
    .max(500, "Must not exceed 500 characters.");

/**
 * TypeScript type inferred from {@link AdminModerationMessageSchema}.
 * Used for typed justification inputs in moderation services.
 */
export type AdminModerationMessage = z.infer<typeof AdminModerationMessageSchema>;