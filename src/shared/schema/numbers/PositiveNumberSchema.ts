import { z } from "zod";
import { NumberValueSchema } from "./NumberValueSchema.js";

/**
 * Schema for validating positive numbers (greater than 0).
 *
 * @remarks
 * - Extends {@link NumberValueSchema} with a `.positive()` refinement.
 * - Throws a validation error if the value is 0 or less.
 * - Ideal for fields such as `ticketPrice`, `quantity`, or any numeric value
 *   that must be strictly positive.
 *
 * @example
 * ```ts
 * PositiveNumberSchema.parse(1);     // ✅ passes
 * PositiveNumberSchema.parse(42);    // ✅ passes
 * PositiveNumberSchema.parse(0);     // ❌ throws ZodError: "Must be 1 or more."
 * PositiveNumberSchema.parse(-5);    // ❌ throws ZodError: "Must be 1 or more."
 * ```
 */
export const PositiveNumberSchema = NumberValueSchema.positive({
    message: "Must be 1 or more.",
});

/**
 * TypeScript type representing a positive number.
 *
 * @remarks
 * - Inferred from {@link PositiveNumberSchema}.
 * - Ensures the value is a number > 0.
 */
export type PositiveNumber = z.infer<typeof PositiveNumberSchema>;
