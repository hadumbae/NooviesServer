import {z} from "zod";
import {isValid, parse} from "date-fns";

/**
 * Schema for date strings in the format `YYYY-MM-DD`.
 *
 * Validates that the input:
 * 1. Is a string
 * 2. Matches the `YYYY-MM-DD` regex
 * 3. Represents a real calendar date (e.g., no February 30th)
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
 * Schema that transforms a valid `YYYY-MM-DD` string into a UTC `Date` object.
 *
 * Validates using {@link DateStringSchema}, then converts the string
 * to a `Date` object in UTC timezone.
 *
 * @example
 * UTCDateStringSchema.parse("2023-04-15"); // ✅ returns new Date('2023-04-15T00:00:00Z')
 */
export const UTCDateStringSchema = DateStringSchema
    .transform(dateString => {
        const [year, month, date] = dateString.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, date));
    });

