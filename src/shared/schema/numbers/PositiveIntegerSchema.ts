/**
 * @fileoverview Zod schema for validating positive integers.
 */

import {z} from "zod";
import {NumberValueSchema} from "@shared/schema/numbers/NumberValueSchema";

/**
 * Zod schema for validating positive integers.
 */
export const PositiveIntegerSchema = NumberValueSchema
    .int({message: "Must be an integer."})
    .positive({message: "Must be a positive number."});

/**
 * Inferred TypeScript type for a validated positive integer.
 */
export type PositiveInteger = z.infer<typeof PositiveIntegerSchema>;