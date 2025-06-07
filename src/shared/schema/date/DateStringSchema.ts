import {z} from "zod";

/**
 * Schema for validating date strings in the "YYYY-MM-DD" format.
 *
 * This schema ensures that the input is a string matching the ISO 8601 date format without time or timezone components.
 *
 * @remarks
 * - The schema does not check for the validity of the date itself (e.g., "2025-02-30" would pass).
 * - For full date validation, consider combining with a refinement or transformation.
 */
export const DateStringSchema = z
    .string({required_error: "Required.", invalid_type_error: "Date must be a string."})
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.");