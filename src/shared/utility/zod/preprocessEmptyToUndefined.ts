import {z, ZodEffects, type ZodTypeAny} from "zod";

/**
 * Wraps a Zod schema to convert empty strings (`""`) into `undefined`
 * before validation or coercion.
 *
 * @remarks
 * Useful in cases where empty strings should not be treated as valid input
 * and can interfere with coercion or validation logic.
 * Common examples include:
 * - Preventing empty strings from being coerced to numbers (`"" → 0`)
 * - Avoiding false "Required" errors for string fields that should allow `undefined`
 * - Normalizing form or query parameters that default to `""`
 *
 * This utility ensures `""` values are normalized to `undefined`
 * before the provided schema runs, allowing optional, nullable, or default logic
 * to handle them correctly.
 *
 * @typeParam TSchema - The inner Zod schema type to wrap.
 *
 * @param schema - The Zod schema that should receive the preprocessed value.
 *
 * @returns A `ZodEffects` schema that first transforms `""` to `undefined`
 * before delegating to the provided schema.
 *
 * @example
 * ```ts
 * import { z } from "zod";
 * import preprocessEmptyToUndefined from "./preprocessEmptyToUndefined";
 *
 * // Prevents empty string from coercing to 0
 * const numberSchema = preprocessEmptyToUndefined(z.coerce.number());
 * numberSchema.parse("");  // ✅ undefined (not 0)
 * numberSchema.parse("42"); // ✅ 42
 *
 * // Prevents empty string from failing "Required"
 * const requiredString = preprocessEmptyToUndefined(z.string().min(1, "Required"));
 * requiredString.parse(""); // ✅ undefined (can be handled as missing)
 * requiredString.parse("Hi"); // ✅ "Hi"
 * ```
 */
export default function preprocessEmptyToUndefined<TSchema extends ZodTypeAny = ZodTypeAny>(
    schema: TSchema
): ZodEffects<TSchema, TSchema["_output"], unknown> {
    return z.preprocess((val) => (val === "" ? undefined : val), schema);
}
