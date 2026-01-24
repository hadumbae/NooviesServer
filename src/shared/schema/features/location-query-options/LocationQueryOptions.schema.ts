/**
 * @file LocationQueryOptions.schema.ts
 *
 * Zod schemas for location-based query parameters.
 *
 * Used by browse and search endpoints to validate structured
 * and free-form location filters.
 */

import {z} from "zod";
import {ISO3166Alpha2CountryCodeSchema} from "../../enums/ISO3166Alpha2CountryCodeSchema.js";
import {NonEmptyStringSchema} from "../../strings/NonEmptyStringSchema.js";

/**
 * Free-form or standardized location marker.
 *
 * Accepts either:
 * - ISO 3166-1 alpha-2 country codes
 * - Human-readable location strings
 */
export const LocationTargetSchema = z.union(
    [
        ISO3166Alpha2CountryCodeSchema,
        NonEmptyStringSchema.max(500, {
            message: "Must be 500 characters or less.",
        }),
    ],
    {
        message: "Must be a valid location marker string.",
    },
);

/**
 * Wrapper object for an optional location target.
 *
 * Used to support broad, user-driven location searches
 * alongside structured location fields.
 */
export const LocationTargetObjectSchema = z.object({
    /** Generic location target (country code or free-text identifier) */
    target: LocationTargetSchema.optional(),
});

/**
 * Location-based query options schema.
 *
 * Combines structured location fields with an optional
 * free-form location target.
 */
export const LocationQueryOptionsSchema = z
    .object({
        /** City name */
        city: NonEmptyStringSchema
            .max(500, {message: "Must be 500 characters or less."})
            .optional(),

        /** State or region name */
        state: NonEmptyStringSchema
            .max(500, {message: "Must be 500 characters or less."})
            .optional(),

        /** ISO 3166-1 alpha-2 country code */
        country: ISO3166Alpha2CountryCodeSchema.optional(),

        /** Postal or ZIP code */
        postalCode: NonEmptyStringSchema.optional(),
    })
    .merge(LocationTargetObjectSchema);
