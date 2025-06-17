import {z} from "zod";

/**
 * Zod schema for a required boolean value.
 *
 * This schema:
 * - Accepts only `true` or `false`
 * - Disallows `undefined`, `null`, or non-boolean types
 * - Returns custom error messages when the value is missing or invalid
 *
 * @example
 * RequiredBoolean.parse(true);  // ✅ OK
 * RequiredBoolean.parse(undefined); // ❌ Throws: "Required"
 * RequiredBoolean.parse("yes"); // ❌ Throws: "Must be a boolean"
 */
export const RequiredBoolean = z.boolean({
    required_error: "Required",
    invalid_type_error: "Must be a boolean",
});