/**
 * @file Zod schema for validating timezone offset strings.
 * @filename TimezoneOffsetSchema.ts
 */

import {StringValueSchema} from "../strings/StringValueSchema.js";
import {z} from "zod";

/**
 * Schema validating timezone offsets in `±HH:MM` format.
 */
export const TimezoneOffsetSchema = StringValueSchema.regex(/^[+-]\d{2}:\d{2}$/, {
    message: "Invalid timezone offset format. Expected ±HH:MM",
});

/**
 * Inferred TypeScript type for {@link TimezoneOffsetSchema}.
 */
export type TimezoneOffsetValue = z.infer<typeof TimezoneOffsetSchema>;