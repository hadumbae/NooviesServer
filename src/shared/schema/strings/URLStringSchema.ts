import { z } from "zod";

/**
 * Schema for validating URL strings.
 *
 * @remarks
 * - Ensures the input is of type `string`.
 * - Throws `"Required."` if the value is `undefined` or `null`.
 * - Throws `"Must be a valid URL string."` if the value is not a string.
 * - Throws `"Must be a valid URL."` if the string is not a properly formatted URL.
 * - Useful for fields like `website`, `link`, `imageUrl`, or any external resource URL.
 *
 * @example
 * ```ts
 * URLStringSchema.parse("https://example.com"); // ✅ passes
 * URLStringSchema.parse("http://localhost:3000"); // ✅ passes
 * URLStringSchema.parse("example.com");         // ❌ throws ZodError: "Must be a valid URL."
 * URLStringSchema.parse("");                     // ❌ throws ZodError
 * URLStringSchema.parse(undefined);              // ❌ throws ZodError: "Required."
 * ```
 */
export const URLStringSchema = z
    .string({ required_error: "Required.", invalid_type_error: "Must be a valid URL string." })
    .url({ message: "Must be a valid URL." });

/**
 * TypeScript type representing a validated URL string.
 *
 * @remarks
 * - Inferred from {@link URLStringSchema}.
 * - Ensures the value is a properly formatted URL string.
 */
export type URLString = z.infer<typeof URLStringSchema>;
