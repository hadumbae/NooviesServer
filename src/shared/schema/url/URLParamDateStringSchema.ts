import {z} from "zod";

/**
 * Schema for validating optional date strings passed as URL parameters.
 *
 * - The value must be a string, if provided.
 * - The format must strictly match `YYYY-MM-DD` (4-digit year, 2-digit month, 2-digit day).
 * - The value is optional and may be `undefined`.
 * - Does **not** validate whether the date is a real calendar date (e.g., "2025-02-30" will pass).
 *
 * @example
 * URLParamDateStringSchema.parse("2025-06-05"); // ✅ valid
 * URLParamDateStringSchema.parse(undefined);    // ✅ valid (optional)
 * URLParamDateStringSchema.parse("2025/06/05"); // ❌ invalid format
 * URLParamDateStringSchema.parse("06-05-2025"); // ❌ invalid format
 */
export const URLParamDateStringSchema = z
    .string({invalid_type_error: "Date must be a string."})
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
    .optional();