/**
 * @file TheatreSnapshotInputSchema.ts
 *
 * @description
 * Zod schema for validating input when creating or updating a theatre snapshot.
 *
 * Captures essential theatre information, including:
 * - Name
 * - Address (street, city, state, postal code)
 * - Country
 * - Timezone
 *
 * Field lengths, types, and optionality are strictly enforced to ensure
 * consistency and prevent invalid data from being persisted.
 *
 * Intended usage:
 * - Validating API request payloads for theatre creation or update
 * - Form input validation in admin interfaces
 * - Embedding validated theatre data into other snapshots
 */
import { z } from "zod";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { ISO3166Alpha2CountryCodeSchema } from "../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import { IANATimezoneSchema } from "../../../shared/schema/date-time/IANATimezoneSchema.js";

/** Zod schema for theatre snapshot input validation. */
export const TheatreSnapshotInputSchema = z.object({
    /** Name of the theatre (max 255 characters). */
    name: NonEmptyStringSchema.max(255, "Must be 255 characters or less."),

    /** Street address of the theatre (optional, max 2000 characters). */
    street: NonEmptyStringSchema
        .max(2000, { message: "Must be 2000 characters or less." })
        .optional(),

    /** City where the theatre is located (max 500 characters). */
    city: NonEmptyStringSchema
        .max(500, { message: "Must be 500 characters or less." }),

    /** State or province of the theatre (optional, max 500 characters). */
    state: NonEmptyStringSchema
        .max(500, { message: "Must be 500 characters or less." })
        .optional(),

    /** ISO 3166-1 alpha-2 country code for the theatre. */
    country: ISO3166Alpha2CountryCodeSchema,

    /** Postal or ZIP code of the theatre (optional). */
    postalCode: NonEmptyStringSchema.optional(),

    /** IANA timezone identifier for the theatre. */
    timezone: IANATimezoneSchema,
});

/** TypeScript type inferred from `TheatreSnapshotInputSchema`. */
export type TheatreSnapshotInputData = z.infer<typeof TheatreSnapshotInputSchema>;
