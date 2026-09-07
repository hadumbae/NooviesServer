/**
 * @fileoverview Zod schema and type definitions for movie image types.
 */

import {z} from "zod";
import {ZodEnumParamHandler} from "@/shared/_feat";

/** Schema for validating supported movie image type enumeration values. */
export const MovieImageTypeSchema = z.enum(["POSTER", "BANNER"], ZodEnumParamHandler({
    invalidValue: "Invalid value. Must be 'POSTER' or 'BANNER'.",
    invalidType: "Invalid type. Must be a string.",
}));

/** Type representing valid movie image types. */
export type MovieImageType = z.infer<typeof MovieImageTypeSchema>;