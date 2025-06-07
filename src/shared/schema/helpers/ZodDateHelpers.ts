import {z} from "zod";

/**
 * Schema for coercing various input types into JavaScript `Date` objects.
 *
 * This schema attempts to coerce inputs like strings or numbers into `Date` instances using `new Date(input)`.
 *
 * @remarks
 * - Be cautious with date strings lacking timezone information, as JavaScript may interpret them in the local timezone.
 * - For consistent UTC parsing, append "T00:00:00Z" to the date string before coercion.
 * - Use `DateStringSchema` for date-only strings.
 */
export const CoercedDateSchema = z
    .coerce
    .date({required_error: "Required.", invalid_type_error: "Must be a valid date."});