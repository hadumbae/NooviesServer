import {z} from "zod";
import {isValid, parse} from "date-fns";

/**
 * Schema for date strings in the format `YYYY-MM-DD`.
 *
 * Validates that the input is:
 * 1. A string
 * 2. Matches the `YYYY-MM-DD` regex
 * 3. Represents a real calendar date (e.g. no February 30th)
 *
 * @example
 * DateStringSchema.parse("2023-04-15"); // ✅ pass
 * DateStringSchema.parse("2023-02-30"); // ❌ fail (invalid date)
 * DateStringSchema.parse("2023-4-5");   // ❌ fail (wrong format)
 */
export const DateStringSchema = z
    .string({required_error: "Required.", invalid_type_error: "Date must be a string."})
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
    .refine(val => isValid(parse(val, "yyyy-MM-dd", new Date())), {message: "Must be a valid YYYY-MM-DD date."});

/**
 * Type representing a valid date string in the "YYYY-MM-DD" format.
 *
 * Inferred from {@link DateStringSchema}. Does not guarantee calendar validity,
 * only that the string conforms to the expected format.
 */
export type DateString = z.infer<typeof DateStringSchema>;