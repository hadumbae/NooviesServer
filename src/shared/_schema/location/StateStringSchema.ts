/**
 * @fileoverview Zod schema and type definition for validating state or region name strings.
 */

import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/** Schema for validating state name strings up to 500 characters. */
export const StateStringSchema = NonEmptyStringSchema.max(500, {message: "Max. 500 Chars"});

/** Inferred type for validated state name strings. */
export type StateString = z.infer<typeof StateStringSchema>;