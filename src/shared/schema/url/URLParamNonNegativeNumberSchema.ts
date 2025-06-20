import {z} from "zod";

/**
 * A Zod schema for parsing a non-negative number from a URL query parameter.
 *
 * This schema:
 * - Coerces the input into a number (e.g. from string query parameters like `"5"`).
 * - Validates that the number is non-negative (i.e., `>= 0`).
 * - Marks the field as optional.
 *
 * Intended for use with query parameters such as `?page=2` or `?limit=10`.
 *
 * @example
 * URLParamNonNegativeNumberSchema.parse("3"); // 3
 * URLParamNonNegativeNumberSchema.parse(undefined); // undefined
 * URLParamNonNegativeNumberSchema.parse("-1"); // throws ZodError
 */
export const URLParamNonNegativeNumberSchema = z
    .coerce
    .number({invalid_type_error: "Must be a number."})
    .nonnegative({message: "Must not be a negative number."})
    .optional();