import { z } from "zod";

/**
 * Zod schema for validating a time string in `HH:mm` 24-hour format.
 *
 * @example
 * ```ts
 * const validTime = "14:30";
 * TimeStringSchema.parse(validTime); // ✅ passes
 *
 * const invalidTime = "25:00";
 * TimeStringSchema.parse(invalidTime); // ❌ throws validation error
 * ```
 *
 * Validation rules:
 * - Required (cannot be empty)
 * - Must be a string
 * - Must match the 24-hour `HH:mm` format, e.g., "00:00" to "23:59"
 */
export const TimeStringSchema = z
    .string({ required_error: "Required.", invalid_type_error: "Time must be a string." })
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Time must be in hh:mm format.");

/**
 * Type representing a time string in `HH:mm` 24-hour format.
 *
 * @example
 * ```ts
 * const startTime: TimeString = "08:15";
 * ```
 */
export type TimeString = z.infer<typeof TimeStringSchema>;
