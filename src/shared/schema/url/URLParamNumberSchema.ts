import {z} from "zod";

/**
 * A Zod schema for parsing optional numeric URL parameters.
 *
 * This schema:
 * - Coerces the input into a number (e.g., from string values like "123").
 * - Returns a validation error with the message "Must be a number." if coercion fails.
 * - Allows the value to be `undefined` (i.e., the parameter is optional).
 *
 * @example
 * URLParamNumber.parse("42");     // -> 42
 * URLParamNumber.parse(undefined); // -> undefined
 * URLParamNumber.parse("abc");   // -> throws ZodError: "Must be a number."
 */
export const URLParamNumberSchema = z
    .coerce
    .number({invalid_type_error: "Must be a number."})
    .optional();