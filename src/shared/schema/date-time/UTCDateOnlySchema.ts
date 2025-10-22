import { SimpleDateStringSchema } from "./SimpleDateStringSchema.js";
import { z } from "zod";

/**
 * Schema that validates a `YYYY-MM-DD` string and transforms it into a UTC `Date` object.
 *
 * @remarks
 * - Uses {@link SimpleDateStringSchema} to validate the input format.
 * - Converts the validated date string into a `Date` object in UTC.
 * - The resulting `Date` will always represent midnight (`00:00:00`) UTC of the given day.
 *
 * @example
 * ```ts
 * UTCDateOnlySchema.parse("2023-04-15");
 * // ✅ Returns: new Date('2023-04-15T00:00:00Z')
 * ```
 *
 * @example
 * ```ts
 * const result: Date = UTCDateOnlySchema.parse("2025-12-01");
 * console.log(result.toISOString());
 * // ✅ "2025-12-01T00:00:00.000Z"
 * ```
 */
export const UTCDateOnlySchema = SimpleDateStringSchema.transform(dateString => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
});

/**
 * TypeScript type representing a UTC `Date` parsed from a valid `YYYY-MM-DD` string.
 */
export type UTCDateOnly = z.infer<typeof UTCDateOnlySchema>;
