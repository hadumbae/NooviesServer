import { z } from "zod";

/**
 * Zod schema that coerces input values into numbers.
 *
 * This schema:
 * - Automatically converts string inputs (e.g. `"42"`) to numbers
 * - Validates that the final value is a valid number
 * - Provides custom error messages for missing or invalid inputs
 *
 * @example
 * CoercedNumberValueSchema.parse("42");   // ✅ returns 42
 * CoercedNumberValueSchema.parse(3.14);   // ✅ returns 3.14
 * CoercedNumberValueSchema.parse("abc");  // ❌ throws "Must be a valid number."
 * CoercedNumberValueSchema.parse(undefined); // ❌ throws "Required."
 */
export const CoercedNumberValueSchema = z.coerce.number({
    required_error: "Required.",
    invalid_type_error: "Must be a valid number.",
});

/**
 * Inferred TypeScript type representing the validated number.
 *
 * Equivalent to:
 * ```ts
 * type CoercedNumberValue = number;
 * ```
 */
export type CoercedNumberValue = z.infer<typeof CoercedNumberValueSchema>;
