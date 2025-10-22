import {z} from 'zod';

import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {ISO3166Alpha2CodeEnumSchema} from "../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";

import {UTCDateOnlySchema} from "../../../shared/schema/date-time/UTCDateOnlySchema.js";

/**
 * Schema for validating input when creating or updating a person.
 *
 * @remarks
 * This schema uses `zod` for validation and enforces the following rules:
 * - `name`: required string between 3 and 255 characters.
 * - `biography`: required string between 1 and 1000 characters.
 * - `dob`: date string in UTC format.
 * - `nationality`: ISO 3166-1 alpha-2 country code.
 *
 * Example usage:
 * ```ts
 * const result = PersonInputSchema.safeParse({
 *   name: "John Doe",
 *   biography: "Software developer from Canada.",
 *   dob: "1990-01-01T00:00:00Z",
 *   nationality: "CA",
 * });
 * if (!result.success) {
 *   console.error(result.error.format());
 * }
 * ```
 */
export const PersonInputSchema = z.object({
    name: RequiredStringSchema
        .min(3, "Must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    biography: RequiredStringSchema
        .min(1, "Required.")
        .max(1000, "Must be 1000 characters or less."),

    dob: UTCDateOnlySchema,

    nationality: ISO3166Alpha2CodeEnumSchema,
});