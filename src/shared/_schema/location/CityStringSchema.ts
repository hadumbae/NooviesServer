/**
 * @fileoverview Zod schema and type definition for validating city name strings.
 */

import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/** Schema for validating city name strings up to 500 characters. */
export const CityStringSchema = NonEmptyStringSchema
    .max(500, {message: "Max. 500 Chars"});

/** Inferred type for validated city name strings. */
export type CityString = z.infer<typeof CityStringSchema>;