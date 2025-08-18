import {z} from "zod";

/**
 * Zod schema for a positive number input.
 *
 * This schema:
 * - Accepts numbers or values that can be coerced to numbers (e.g., numeric strings like "42").
 * - Requires the value to be greater than 0.
 * - `null`, `undefined`, or non-numeric strings are rejected.
 *
 * Validation errors:
 * - `required_error`: Triggered when the input is `undefined` or `null`.
 * - `invalid_type_error`: Triggered when the input cannot be coerced to a number.
 * - `gt` message: Triggered when the number is not greater than 0.
 *
 * Example usage:
 * ```ts
 * PositiveNumberSchema.parse("42");   // 42
 * PositiveNumberSchema.parse(3.5);    // 3.5
 * PositiveNumberSchema.parse(0);       // throws
 * PositiveNumberSchema.parse(-5);      // throws
 * PositiveNumberSchema.parse("abc");   // throws
 * ```
 */
export const PositiveNumberSchema = z
    .coerce
    .number({required_error: "Required.", invalid_type_error: "Must be a positive number."})
    .gt(0, "Must be a positive number.");