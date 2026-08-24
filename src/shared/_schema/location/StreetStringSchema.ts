/**
 * @fileoverview Zod schema and type definition for validating street address strings.
 */

import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/** Schema for validating street address strings up to 2000 characters. */
export const StreetStringSchema = NonEmptyStringSchema.max(2000, {message: "Max. 2000 Chars"});

/** Inferred type for validated street address strings. */
export type StreetString = z.infer<typeof StreetStringSchema>;