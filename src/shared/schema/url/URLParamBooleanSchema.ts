import {z} from "zod";

/**
 * Zod schema for parsing a flexible boolean parameter.
 *
 * This schema accepts the string literals `"true"` and `"false"`—converting them
 * into actual boolean values—as well as native boolean types (`true`, `false`).
 *
 * Useful for parsing boolean query parameters from URL strings or form data where
 * values may be passed as strings but interpreted as booleans.
 *
 * Returns:
 * - `true` if the value is `"true"` or `true`
 * - `false` if the value is `"false"` or `false`
 * - `undefined` if the value is not present (due to `.optional()`)
 *
 * @example
 * ```ts
 * ParamBoolean.parse("true");  // true
 * ParamBoolean.parse("false"); // false
 * ParamBoolean.parse(true);    // true
 * ParamBoolean.parse(false);   // false
 * ParamBoolean.parse(undefined); // undefined
 * ```
 */
export const URLParamBooleanSchema = z
    .union(
        [z.literal("true").transform(() => true), z.literal("false").transform(() => false), z.boolean()],
        {message: "Invalid boolean string."},
    )
    .optional();