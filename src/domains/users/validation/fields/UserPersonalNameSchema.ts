/**
 * @fileoverview Zod validation schema and type definition for a user's personal name.
 */

import {z} from "zod";
import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";

/** Zod schema for validating a user's personal name string. */
export const UserPersonalNameSchema = StringValueSchema.min(3, "Min. 3 Characters").max(255, "Max. 255 Characters");

/** Type representing a validated user personal name. */
export type UserPersonalName = z.infer<typeof UserPersonalNameSchema>;