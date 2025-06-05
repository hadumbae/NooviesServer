import {z} from "zod";

/**
 * A Zod schema for optional string URL parameters that trims input
 * and normalizes empty or whitespace-only strings to `undefined`.
 *
 * This schema:
 * - Accepts `string` values or `undefined`.
 * - Trims leading and trailing whitespace from strings.
 * - Converts empty or whitespace-only strings to `undefined`.
 * - Returns trimmed strings otherwise.
 *
 * @example
 * URLParamStringSchema.parse("  hello  "); // -> "hello"
 * URLParamStringSchema.parse("");          // -> undefined
 * URLParamStringSchema.parse("   ");       // -> undefined
 * URLParamStringSchema.parse(undefined);   // -> undefined
 */
export const URLParamStringSchema = z
    .coerce
    .string({invalid_type_error: "Must be a string."})
    .optional()
    .transform((value) => typeof value === "string" && value.trim() !== "" ? value.trim() : undefined);