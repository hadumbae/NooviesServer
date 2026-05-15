/**
 * @fileoverview Zod schema and type definition for movie runtime validation.
 */

import {z} from "zod";
import {PositiveNumberSchema} from "@shared/schema/numbers/PositiveNumberSchema";

/** Zod schema for validating a movie runtime in minutes. */
export const MovieRuntimeSchema = PositiveNumberSchema.lte(500, "Must be 500 or less.");

/** Type inferred from the MovieRuntimeSchema. */
export type MovieRuntime = z.infer<typeof MovieRuntimeSchema>;