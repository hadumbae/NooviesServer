import {z} from "zod";
import {DateTime} from "luxon";

/**
 * **URLParamDateOnlySchema**
 *
 * Zod schema for validating and transforming URL parameters that represent **date-only** values
 * in the format `yyyy-MM-dd`.
 *
 * ### Behavior
 * - Expects a string in the format `yyyy-MM-dd`.
 * - Validates the format using a regular expression.
 * - Transforms the string into a Luxon `DateTime` object starting at midnight (00:00).
 * - Ensures the resulting `DateTime` is valid.
 * - Converts the valid `DateTime` to a native JavaScript `Date` object.
 * - Accepts `undefined` (optional schema).
 *
 * ### Example
 * ```ts
 * const result = URLParamDateOnlySchema.parse("2025-11-07");
 * // => Date object representing 2025-11-07T00:00:00.000Z
 *
 * const invalid = URLParamDateOnlySchema.safeParse("2025/11/07");
 * // => { success: false, error: [ZodError: Date must be in yyyy-MM-dd format.] }
 * ```
 */
export const URLParamDateOnlySchema = z
    .string({ invalid_type_error: "Date must be a string." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in yyyy-MM-dd format.")
    .transform(v => DateTime.fromFormat(v, "yyyy-MM-dd").startOf("day"))
    .refine(v => v.isValid, "Invalid Date.")
    .transform(v => v.toJSDate())
    .optional();
