import { z } from "zod";
import { CoercedNumberValueSchema } from "./CoercedNumberValueSchema.js";

/**
 * Zod schema that coerces input values into non-negative numbers.
 *
 * This schema:
 * - Converts string inputs (e.g. `"5"`) into numbers
 * - Ensures the result is a valid, non-negative number (≥ 0)
 * - Returns a custom error message when the value is negative or invalid
 *
 * @example
 * CoercedNonNegativeNumberSchema.parse("10");  // ✅ returns 10
 * CoercedNonNegativeNumberSchema.parse(0);     // ✅ returns 0
 * CoercedNonNegativeNumberSchema.parse(-5);    // ❌ throws "Must be a non-negative number."
 * CoercedNonNegativeNumberSchema.parse("abc"); // ❌ throws "Must be a valid number."
 */
export const CoercedNonNegativeNumberSchema = CoercedNumberValueSchema.nonnegative({
    message: "Must be a non-negative number.",
});

/**
 * Inferred TypeScript type representing a validated non-negative number.
 *
 * Equivalent to:
 * ```ts
 * type CoercedNonNegativeNumber = number;
 * ```
 */
export type CoercedNonNegativeNumber = z.infer<typeof CoercedNonNegativeNumberSchema>;
