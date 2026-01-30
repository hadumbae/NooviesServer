/**
 * @file DateInstanceSchema.ts
 *
 * Zod schema for validating JavaScript {@link Date} instances.
 *
 * @remarks
 * Ensures the value is an actual {@link Date} object rather than
 * a string, number, or serialized timestamp. Intended for internal
 * validation where Date instances are required.
 */

import { z } from "zod";

/**
 * Schema validating a {@link Date} instance.
 */
export const DateInstanceSchema = z.instanceof(
    Date,
    { message: "Must be an instance of Date." }
);

/**
 * Type representing a validated {@link Date} instance.
 */
export type DateInstance = z.infer<typeof DateInstanceSchema>;
