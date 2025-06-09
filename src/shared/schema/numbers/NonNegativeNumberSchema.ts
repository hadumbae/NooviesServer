import {z} from "zod";

/**
 * Schema for validating non-negative numbers (>= 0).
 *
 * - Accepts only **finite numbers** ≥ 0.
 * - Rejects `NaN`, `Infinity`, negative numbers, strings, booleans, etc.
 * - Provides custom error messages:
 *   - `"Required."` if the input is `undefined` or missing.
 *   - `"Must be a positive number."` if the input is the wrong type.
 *   - `"Must be at least 0."` if the number is negative.
 *
 * @example
 * NonNegativeNumberSchema.parse(0);      // ✅ 0
 * NonNegativeNumberSchema.parse(10.5);   // ✅ 10.5
 * NonNegativeNumberSchema.safeParse(-1)  // ❌ ZodError: "Must be at least 0."
 * NonNegativeNumberSchema.safeParse("5") // ❌ ZodError: "Must be a positive number."
 * NonNegativeNumberSchema.safeParse(NaN) // ❌ ZodError: invalid number
 */
export const NonNegativeNumberSchema = z
    .number({required_error: "Required.", invalid_type_error: "Must be a positive number."})
    .nonnegative({message: "Must be at least 0."});
