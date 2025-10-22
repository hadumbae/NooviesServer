import { z } from "zod";
import { NumberValueSchema } from "./NumberValueSchema.js";

/**
 * Schema for validating non-negative numbers (0 or greater).
 *
 * @remarks
 * - Extends {@link NumberValueSchema} with a `.nonnegative()` refinement.
 * - Throws a validation error if the value is less than 0.
 * - Ideal for fields such as `ticketPrice`, `quantity`, or any numeric value
 *   that must not be negative.
 *
 * @example
 * ```ts
 * NonNegativeNumberSchema.parse(0);     // ✅ passes
 * NonNegativeNumberSchema.parse(42);    // ✅ passes
 * NonNegativeNumberSchema.parse(-5);    // ❌ throws ZodError: "Must be 0 or more."
 * ```
 */
export const NonNegativeNumberSchema = NumberValueSchema.nonnegative({
    message: "Must be 0 or more.",
});

/**
 * TypeScript type representing a non-negative number.
 *
 * @remarks
 * - Inferred from {@link NonNegativeNumberSchema}.
 * - Ensures the value is a number ≥ 0.
 */
export type NonNegativeNumber = z.infer<typeof NonNegativeNumberSchema>;
