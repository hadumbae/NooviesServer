import {z} from "zod";

/**
 * A URL string schema.
 *
 * Validates that the value is a properly formatted URL string.
 * Suitable for fields such as website URLs or image links.
 *
 * @example
 * const result = ValidURLStringSchema.parse("https://example.com"); // "https://example.com"
 */
export const ValidURLStringSchema = z
    .string({required_error: "Required.", invalid_type_error: "Must be a valid URL string."})
    .url({message: "Must be a valid URL."});