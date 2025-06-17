import {z} from "zod";

/**
 * A Zod schema that coercively parses input into a boolean value,
 * intended for use in backend APIs or form handlers where input types may vary.
 *
 * @remarks
 * - Uses `z.coerce.boolean()` to convert common input types to booleans.
 *   - `"true"` → `true`
 *   - `"false"` → `false`
 *   - `1` → `true`
 *   - `0` → `false`
 * - Throws `"Required."` if the input is `undefined` or `null`.
 * - Throws `"Invalid type"` if the input cannot be coerced into a boolean.
 * - Ideal for parsing query strings, form values, or loosely-typed request bodies.
 *
 * @example
 * ```ts
 * CoercedBooleanSchema.parse("true");  // ✅ true
 * CoercedBooleanSchema.parse("false"); // ✅ false
 * CoercedBooleanSchema.parse(1);       // ✅ true
 * CoercedBooleanSchema.parse(0);       // ✅ false
 * CoercedBooleanSchema.parse(undefined); // ❌ Throws "Required."
 * CoercedBooleanSchema.parse("yes");     // ❌ Throws "Invalid type"
 * ```
 */
 export const CoercedBooleanSchema = z.coerce.boolean({
  required_error: "Required.",
  invalid_type_error: "Must be a boolean.",
 });

/**
 * A TypeScript type representing a coerced boolean value.
 *
 * @remarks
 * - Inferred from {@link CoercedBooleanSchema}.
 * - Ensures the value is a properly coerced `boolean` (`true` or `false`).
 */
 export type CoercedBoolean = z.infer<typeof CoercedBooleanSchema>;