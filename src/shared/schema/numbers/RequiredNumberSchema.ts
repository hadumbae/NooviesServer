import {z} from "zod";

/**
 * Schema that expects the input to already be a number.
 * Throws if the input is `string`, `boolean`, etc.
 *
 * @example
 * RequiredNumberSchema.parse(42);     // ✅ 42
 * RequiredNumberSchema.parse("42");   // ❌ ZodError: expected number
 */
export const RequiredNumberSchema = z.number({
    required_error: "Required.",
    invalid_type_error: "Must be a valid number."
});