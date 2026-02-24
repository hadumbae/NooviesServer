/**
 * @file Positive integer Zod schema.
 * PositiveIntegerSchema.ts
 */

import { PositiveNumberSchema } from "./PositiveNumberSchema.js";
import { z } from "zod";

/**
 * Zod schema for validating positive integers.
 */
export const PositiveIntegerSchema = PositiveNumberSchema.refine(
    (val) => Number.isInteger(val),
    { message: "Must be a positive integer." }
);

/**
 * Inferred TypeScript type for a validated positive integer.
 */
export type PositiveInteger = z.infer<typeof PositiveIntegerSchema>;