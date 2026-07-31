/**
 * @fileoverview Validation schema and types for moderation log audit messages.
 */

import {z} from "zod";
import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";

/** Zod schema enforcing string length and constraint boundaries for moderation log messages. */
export const ModerationLogMessageSchema = StringValueSchema
    .trim()
    .min(1, "Min. 1 Chars")
    .max(500, "Max. 500 Chars");

/** TypeScript type inferred from the ModerationLogMessageSchema. */
export type ModerationLogMessage = z.infer<typeof ModerationLogMessageSchema>;