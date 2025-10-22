import { z } from "zod";

/**
 * Schema for validating non-empty strings.
 *
 * @remarks
 * - Ensures the input is of type `string`.
 * - Throws `"Required."` if the value is `undefined` or `null`.
 * - Throws `"Must be a valid string."` if the value is not a string.
 * - Throws `"Must not be an empty string."` if the string is empty.
 * - Automatically trims leading and trailing whitespace.
 * - Useful for fields like `name`, `title`, `description`, etc.
 *
 * @example
 * ```ts
 * NonEmptyStringSchema.parse("Hello");  // ✅ passes, returns "Hello"
 * NonEmptyStringSchema.parse("  Hello "); // ✅ passes, returns "Hello" (trimmed)
 * NonEmptyStringSchema.parse("");       // ❌ throws ZodError: "Must not be an empty string."
 * NonEmptyStringSchema.parse("   ");    // ❌ throws ZodError: "Must not be an empty string."
 * NonEmptyStringSchema.parse(undefined); // ❌ throws ZodError: "Required."
 * ```
 */
export const NonEmptyStringSchema = z
    .string({ required_error: "Required.", invalid_type_error: "Must be a valid string." })
    .min(1, "Must not be an empty string.")
    .trim();

/**
 * TypeScript type representing a validated non-empty string.
 *
 * @remarks
 * - Inferred from {@link NonEmptyStringSchema}.
 * - Ensures the value is a non-empty, trimmed string.
 */
export type NonEmptyString = z.infer<typeof NonEmptyStringSchema>;
