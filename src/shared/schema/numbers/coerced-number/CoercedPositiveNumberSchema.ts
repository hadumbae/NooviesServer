import { CoercedNumberValueSchema } from "./CoercedNumberValueSchema.js";
import { z } from "zod";

/**
 * Zod schema that coerces input values into positive numbers.
 *
 * This schema:
 * - Converts string inputs (e.g. `"3.5"`) into numbers
 * - Ensures the result is strictly greater than 0
 * - Returns a custom error message when the value is zero, negative, or invalid
 *
 * @example
 * CoercedPositiveNumberSchema.parse("7");   // ✅ returns 7
 * CoercedPositiveNumberSchema.parse(2.5);   // ✅ returns 2.5
 * CoercedPositiveNumberSchema.parse(0);     // ❌ throws "Must be a positive number."
 * CoercedPositiveNumberSchema.parse(-3);    // ❌ throws "Must be a positive number."
 * CoercedPositiveNumberSchema.parse("abc"); // ❌ throws "Must be a valid number."
 */
export const CoercedPositiveNumberSchema = CoercedNumberValueSchema.positive({
    message: "Must be a positive number.",
});

/**
 * Inferred TypeScript type representing a validated positive number.
 *
 * Equivalent to:
 * ```ts
 * type CoercedPositiveNumber = number;
 * ```
 */
export type CoercedPositiveNumber = z.infer<typeof CoercedPositiveNumberSchema>;
