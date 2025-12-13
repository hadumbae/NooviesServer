import { z } from "zod";
import { NumberValueSchema } from "./NumberValueSchema.js";

/**
 * @summary
 * Zod schema for validating numbers greater than 0.
 *
 * Extends {@link NumberValueSchema} with `.positive()` refinement.
 *
 * @example
 * PositiveNumberSchema.parse(1);   // ✅ passes
 * PositiveNumberSchema.parse(42);  // ✅ passes
 * PositiveNumberSchema.parse(0);   // ❌ throws ZodError
 * PositiveNumberSchema.parse(-5);  // ❌ throws ZodError
 */
export const PositiveNumberSchema = NumberValueSchema.positive({
    message: "Must be more than 0.",
});

/**
 * @summary
 * Type representing a positive number (>0).
 *
 * Inferred from {@link PositiveNumberSchema}.
 */
export type PositiveNumber = z.infer<typeof PositiveNumberSchema>;
