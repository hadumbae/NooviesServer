/**
 * @fileoverview Defines the validation schema and type for password strings.
 */

import {z} from "zod";
import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";

/** Zod schema for validating password strings between 16 and 255 characters. */
export const PasswordStringSchema = StringValueSchema.min(16, "Min. 16 Chars").max(255, "Max. 255 Chars");

/** Type definition for a validated password string. */
export type PasswordString = z.infer<typeof PasswordStringSchema>;