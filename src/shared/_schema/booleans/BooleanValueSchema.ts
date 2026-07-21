import { z } from "zod";

/**
 * Schema for validating required boolean values.
 *
 * @remarks
 * - Accepts only `true` or `false`.
 * - Disallows `undefined`, `null`, or any non-boolean types.
 * - Provides descriptive error messages for missing or invalid values.
 *
 * Commonly used for boolean flags such as `isActive`, `isPublished`, or `isSpecialEvent`.
 *
 * @example
 * ```ts
 * BooleanValueSchema.parse(true);       // ✅ passes
 * BooleanValueSchema.parse(false);      // ✅ passes
 * BooleanValueSchema.parse(undefined);  // ❌ throws "Required"
 * BooleanValueSchema.parse("yes");      // ❌ throws "Must be a boolean"
 * ```
 */
export const BooleanValueSchema = z.boolean({
    required_error: "Required",
    invalid_type_error: "Must be a boolean",
});

/**
 * TypeScript type representing a validated boolean value.
 *
 * @remarks
 * This type is inferred directly from {@link BooleanValueSchema}.
 */
export type BooleanValue = z.infer<typeof BooleanValueSchema>;
