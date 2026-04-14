/**
 * @fileoverview Validation schema and types for Person input data.
 * Enforces constraints for name, biography, date of birth, and nationality.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import {UTCDateOnlySchema} from "@shared/schema/date-time/UTCDateOnlySchema";

/**
 * Validates Person data for creation or updates.
 */
export const PersonInputSchema = z.object({
    /** 3-255 characters. */
    name: NonEmptyStringSchema
        .min(3, "Must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    /** 1-1000 characters. */
    biography: NonEmptyStringSchema
        .min(1, "Required.")
        .max(1000, "Must be 1000 characters or less."),

    /** Valid UTC date-only string. */
    dob: UTCDateOnlySchema,

    /** Valid ISO 3166-1 alpha-2 code. */
    nationality: ISO3166Alpha2CountryCodeSchema,
});

/**
 * Type representing the validated input data for a Person.
 */
export type PersonInputData = z.infer<typeof PersonInputSchema>;