import { z } from "zod";

/**
 * Schema for validating required numeric values.
 *
 * @remarks
 * - Accepts only JavaScript `number` types.
 * - Does not coerce strings, booleans, or other types into numbers.
 * - Provides descriptive error messages for missing or invalid values.
 * - Ideal for fields such as `ticketPrice`, `quantity`, or other numeric inputs.
 *
 * @example
 * ```ts
 * NumberValueSchema.parse(42);     // ✅ passes, returns 42
 * NumberValueSchema.parse(3.14);   // ✅ passes, returns 3.14
 * NumberValueSchema.parse("42");   // ❌ throws ZodError: "Must be a valid number."
 * NumberValueSchema.parse(undefined); // ❌ throws ZodError: "Required."
 * ```
 */
export const NumberValueSchema = z.number({
    required_error: "Required.",
    invalid_type_error: "Must be a valid number.",
});

/**
 * TypeScript type representing a required number.
 *
 * @remarks
 * - Inferred from {@link NumberValueSchema}.
 * - Ensures the value is a proper `number`.
 */
export type NumberValue = z.infer<typeof NumberValueSchema>;
