/**
 * @fileoverview Zod validation schema for theatre snapshot input data.
 */

import { z } from "zod";
import { NonEmptyStringSchema } from "@shared/schema/strings/NonEmptyStringSchema";
import { ISO3166Alpha2CountryCodeSchema } from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import { IANATimezoneSchema } from "@shared/schema/date-time/IANATimezoneSchema";

/**
 * Validates the administrative input required to generate a point-in-time theatre snapshot.
 * Enforces strict character limits and standardized formats for country codes and timezones.
 */
export const TheatreSnapshotInputSchema = z.object({
    name: NonEmptyStringSchema.max(255, "Must be 255 characters or less."),
    street: NonEmptyStringSchema.max(2000, { message: "Must be 2000 characters or less." }).optional(),
    city: NonEmptyStringSchema.max(500, { message: "Must be 500 characters or less." }),
    state: NonEmptyStringSchema.max(500, { message: "Must be 500 characters or less." }).optional(),
    country: ISO3166Alpha2CountryCodeSchema,
    postalCode: NonEmptyStringSchema.optional(),
    timezone: IANATimezoneSchema,
});

/**
 * Type definition for theatre snapshot input, inferred from the validation schema.
 */
export type TheatreSnapshotInputData = z.infer<typeof TheatreSnapshotInputSchema>;