import {URLParamStringSchema} from "./URLParamStringSchema.js";

/**
 * A Zod schema for parsing and escaping string values intended for use in regular expressions.
 *
 * This schema extends `URLParamStringSchema` by transforming the input string:
 * - If the input is a string, it escapes all characters with special meaning in regular expressions.
 * - If the input is not a string, it resolves to `undefined`.
 *
 * @remarks
 * This is useful for safely using user-provided query parameters in MongoDB `$regex` queries
 * without allowing unintended regex patterns or injection.
 *
 * @example
 * ```ts
 * const input = "hello.world";
 * const parsed = URLParamRegexStringSchema.parse(input);
 * // parsed === "hello\\.world"
 * ```
 *
 * @see {@link URLParamStringSchema} for the base string parsing behavior.
 */
export const URLParamRegexStringSchema = URLParamStringSchema
    .transform(
        (value) => typeof value === "string"
            ? value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            : undefined
    );