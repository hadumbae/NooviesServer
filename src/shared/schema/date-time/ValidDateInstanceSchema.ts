/**
 * @file DateInstanceSchema.ts
 *
 * @description
 * Zod schema for validating JavaScript `Date` objects and ensuring they are valid.
 *
 * This schema checks two things:
 * 1. The value is a true `Date` instance.
 * 2. The date is valid (e.g., not `new Date("invalid")`).
 *
 * Usage:
 * ```ts
 * DateInstanceSchema.parse(new Date()); // ✅ valid
 * DateInstanceSchema.parse(new Date("invalid")); // ❌ invalid
 * DateInstanceSchema.parse("2025-12-21"); // ❌ invalid
 * ```
 */
import {z} from "zod";

/** Zod schema for validating a valid Date instance. */
export const ValidDateInstanceSchema = z
    .instanceof(Date)
    .refine(
        (date) => !isNaN(date.getTime()),
        {message: "Invalid date."},
    );
