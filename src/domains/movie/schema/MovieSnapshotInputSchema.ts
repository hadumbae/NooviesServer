/**
 * @file MovieSnapshotInputSchema.ts
 *
 * @description
 * Zod schema for validating input when creating or updating a movie snapshot.
 *
 * Ensures that essential movie metadata is captured and validated, including:
 * - Title and original title
 * - Tagline
 * - Poster URL
 * - Release date
 * - Genres
 * - Runtime
 * - Production country
 *
 * Field lengths, formats, and optionality are strictly enforced to maintain
 * consistency and prevent invalid data from being persisted.
 *
 * Intended usage:
 * - Validating API requests for movie creation or update
 * - Form input validation in admin interfaces
 * - Embedding validated movie data into showing or reservation snapshots
 */
import { z } from "zod";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { URLStringSchema } from "../../../shared/schema/strings/URLStringSchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ISO3166Alpha2CountryCodeSchema } from "../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import { UTCDateOnlySchema } from "../../../shared/schema/date-time/UTCDateOnlySchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";

/** Zod schema for movie snapshot input validation. */
export const MovieSnapshotInputSchema = z.object({
    /** Movie title (max 250 characters). */
    title: NonEmptyStringSchema.max(250, "Must be 250 characters or less."),

    /** Original movie title (optional, max 250 characters). */
    originalTitle: NonEmptyStringSchema
        .max(250, "Must be 250 characters or less.")
        .optional(),

    /** Tagline or short description (optional, max 100 characters, nullable). */
    tagline: NonEmptyStringSchema
        .max(100, "Must be 100 characters or less.")
        .optional()
        .nullable(),

    /** URL to the movie poster (optional, nullable). */
    posterURL: URLStringSchema.optional().nullable(),

    /** Movie release date in UTC (optional, nullable). */
    releaseDate: UTCDateOnlySchema.optional().nullable(),

    /** List of genres (each max 150 characters). */
    genres: generateArraySchema(
        NonEmptyStringSchema.max(150, "Must be 150 characters or less.")
    ),

    /** Runtime in minutes (positive number, max 500). */
    runtime: PositiveNumberSchema.lte(500, "Must be 500 or less."),

    /** Production country (ISO 3166-1 alpha-2 code). */
    country: ISO3166Alpha2CountryCodeSchema,
});

/** TypeScript type inferred from `MovieSnapshotInputSchema`. */
export type MovieSnapshotInputData = z.infer<typeof MovieSnapshotInputSchema>;
