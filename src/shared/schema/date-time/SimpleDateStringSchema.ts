import { z } from "zod";
import { isValid, parse } from "date-fns";

/**
 * Schema for validating date strings in the `YYYY-MM-DD` format.
 *
 * @remarks
 * This schema ensures that a string:
 * 1. Is of type `string`.
 * 2. Matches the exact `YYYY-MM-DD` format.
 * 3. Represents a valid calendar date (e.g., no February 30th).
 *
 * Internally, it uses `date-fns` to parse and validate real dates.
 * This schema is commonly used as a base for other date transformations,
 * such as {@link UTCDateOnlySchema}, which converts the string into a UTC `Date` object.
 *
 * @example
 * ```ts
 * SimpleDateStringSchema.parse("2023-04-15"); // ✅ passes
 * SimpleDateStringSchema.parse("2023-02-30"); // ❌ fails (invalid date)
 * SimpleDateStringSchema.parse("2023-4-5");   // ❌ fails (wrong format)
 * ```
 *
 * @example
 * ```ts
 * const validDate: SimpleDateString = SimpleDateStringSchema.parse("2025-12-01");
 * console.log(validDate); // "2025-12-01"
 * ```
 */
export const SimpleDateStringSchema = z
    .string({ required_error: "Required.", invalid_type_error: "Date must be a string." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
    .refine(
        val => isValid(parse(val, "yyyy-MM-dd", new Date())),
        { message: "Must be a valid YYYY-MM-DD date." }
    );

/**
 * TypeScript type representing a valid date string in `YYYY-MM-DD` format.
 *
 * @remarks
 * This type is inferred from {@link SimpleDateStringSchema}.
 */
export type SimpleDateString = z.infer<typeof SimpleDateStringSchema>;
