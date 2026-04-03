/**
 * @file Zod schema and type for standardized system identification codes.
 * @filename UniqueCodeSchema.ts
 */

import {StringValueSchema} from "@shared/schema/strings/StringValueSchema";
import {z} from "zod";

/**
 * Validates unique identification strings against the system-wide naming convention.
 */
export const UniqueCodeSchema = StringValueSchema.regex(
    /^[A-Z]{3}-[A-Z0-9]{5}-[A-Z0-9]{5}$/,
    {message: "Invalid format. Expected XXX-XXXXX-XXXXX (e.g., USR-K9P2W-LM4X1)"},
);

/**
 * TypeScript type inferred from {@link UniqueCodeSchema}.
 * Represents a validated, uppercase unique identifier string.
 */
export type UniqueCode = z.infer<typeof UniqueCodeSchema>;