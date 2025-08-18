import {z} from "zod";

/**
 * Schema for validating a non-negative number.
 *
 * Accepts either:
 * - A string that can be parsed into a non-negative number (e.g., "0", "42")
 * - A numeric value (e.g., 0, 42)
 *
 * Validates that:
 * - The value is not empty
 * - The value is a number
 * - The value is greater than or equal to 0
 *
 * Transforms the input into a `number`.
 *
 * Example usage:
 * ```ts
 * NonNegativeNumberSchema.parse("42"); // 42
 * NonNegativeNumberSchema.parse(0);    // 0
 * NonNegativeNumberSchema.parse("-1"); // throws validation error
 * ```
 */
export const NonNegativeNumberSchema = z
    .union(
        [z.string().trim(), z.number()],
        {required_error: "Required.", invalid_type_error: "Must be a non-negative number."},
    ).refine((val) => {
        const num = Number(val);
        return val !== "" && !(isNaN(num) || num < 0);
    }, {message: "Must be a non-negative number."})
    .transform(Number);