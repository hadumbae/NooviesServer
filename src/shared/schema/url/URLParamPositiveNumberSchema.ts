import {z} from "zod";

/**
 * Zod schema for validating optional positive numbers from URL parameters.
 *
 * This schema is designed for use with Express query parameters or route params
 * where values are initially strings and need to be converted to positive numbers.
 *
 * Validation steps:
 * 1. Ensures the value is a string (`invalid_type_error` if not).
 * 2. Rejects empty strings (`""`).
 * 3. Transforms the string into a number.
 * 4. Validates that the number is strictly positive (`> 0`).
 * 5. Optional: allows the parameter to be omitted entirely.
 *
 * Example usage:
 * ```ts
 * const pageSchema = URLParamPositiveNumberSchema;
 *
 * const page = pageSchema.parse(req.query.page);
 * // "5" => 5
 * // ""  => throws "Must not be an empty string."
 * // "-3" => throws "Must be a positive number."
 * // undefined => passes (optional)
 * ```
 */
export const URLParamPositiveNumberSchema = z
    .string({invalid_type_error: "Must be a valid string."})
    .nonempty("Must not be an empty string.")
    .transform(value => Number(value))
    .refine(value => value > 0, {message: "Must be a positive number."})
    .optional();
