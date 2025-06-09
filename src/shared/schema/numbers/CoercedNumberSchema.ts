import {z} from "zod";

/**
 * Zod schema that coerces input into a valid number.
 *
 * This schema attempts to convert various input types into a number:
 * - Strings representing numeric values (e.g., `"42"`)
 * - Boolean values (`true` becomes `1`, `false` becomes `0`)
 * - `null` becomes `0`
 * - Undefined values are treated as invalid and will trigger a validation error
 *
 * If the input cannot be coerced into a valid number, the schema will throw an error with the message:
 * - `"Required."` if the input is `undefined`
 * - `"Must be a valid number."` if the input cannot be converted to a number
 *
 * @example
 * ```ts
 * CoercedNumberSchema.parse("42");    // ✅ 42
 * CoercedNumberSchema.parse("3.14");  // ✅ 3.14
 * CoercedNumberSchema.parse(true);    // ✅ 1
 * CoercedNumberSchema.parse(false);   // ✅ 0
 * CoercedNumberSchema.parse(null);    // ✅ 0
 * CoercedNumberSchema.parse(undefined); // ❌ throws "Required."
 * CoercedNumberSchema.parse("hello"); // ❌ throws "Must be a valid number."
 * ```
 */
export const CoercedNumberSchema = z
    .coerce
    .number({
        required_error: "Required.",
        invalid_type_error: "Must be a valid number.",
    });