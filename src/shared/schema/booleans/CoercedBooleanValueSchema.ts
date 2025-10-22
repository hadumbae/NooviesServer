import { z } from "zod";

/**
 * Schema that coercively parses input into a boolean value.
 *
 * @remarks
 * - Uses `z.coerce.boolean()` to convert common input types to booleans:
 *   - `"true"` → `true`
 *   - `"false"` → `false`
 *   - `1` → `true`
 *   - `0` → `false`
 * - Throws `"Required."` if the input is `undefined` or `null`.
 * - Throws `"Must be a boolean."` if the input cannot be coerced into a boolean.
 * - Ideal for parsing query strings, form values, or loosely-typed request bodies.
 *
 * @example
 * ```ts
 * CoercedBooleanValueSchema.parse("true");      // ✅ true
 * CoercedBooleanValueSchema.parse("false");     // ✅ false
 * CoercedBooleanValueSchema.parse(1);           // ✅ true
 * CoercedBooleanValueSchema.parse(0);           // ✅ false
 * CoercedBooleanValueSchema.parse(undefined);   // ❌ Throws "Required."
 * CoercedBooleanValueSchema.parse("yes");       // ❌ Throws "Must be a boolean."
 * ```
 */
export const CoercedBooleanValueSchema = z.coerce.boolean({
 required_error: "Required.",
 invalid_type_error: "Must be a boolean.",
});

/**
 * TypeScript type representing a coerced boolean value.
 *
 * @remarks
 * - Inferred from {@link CoercedBooleanValueSchema}.
 * - Ensures the value is a properly coerced `boolean` (`true` or `false`).
 */
export type CoercedBooleanValue = z.infer<typeof CoercedBooleanValueSchema>;
