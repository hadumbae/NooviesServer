import {z} from "zod";

/**
 * A required trimmed string schema.
 *
 * This schema ensures the value is a non-empty string with leading and trailing whitespace removed.
 * Useful for validating standard required string inputs such as names or titles.
 *
 * @example
 * const result = RequiredString.parse("  Hello  "); // "Hello"
 */
export const RequiredStringSchema = z
    .string({required_error: "Required.", invalid_type_error: "Must be a valid string."})
    .min(1, "Must be at least 1 character long.")
    .trim();