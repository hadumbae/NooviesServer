/**
 * @file MovieSnapshotInputSchema.ts
 *
 * Zod schema for validating input used to create a movie snapshot.
 *
 * This schema ensures that all required movie metadata is present and
 * structurally valid before being embedded into immutable snapshots
 * such as showings or reservations.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import {ISO3166Alpha2CountryCodeSchema} from "../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";
import {DateInstanceSchema} from "../../../shared/schema/date-time/DateInstanceSchema.js";
import {URLStringSchema} from "../../../shared/schema/strings/URLStringSchema.js";

/**
 * Input validation schema for movie snapshot creation.
 *
 * @remarks
 * Intended for internal use when constructing immutable snapshot data.
 */
export const MovieSnapshotInputSchema = z.object({
    /** Localized display title. */
    title: NonEmptyStringSchema.max(250, "Must be 250 characters or less."),

    /** Original release title. */
    originalTitle: NonEmptyStringSchema
        .max(250, "Must be 250 characters or less."),

    /** Optional marketing tagline. */
    tagline: NonEmptyStringSchema
        .max(100, "Must be 100 characters or less.")
        .optional()
        .nullable(),

    /** Optional poster image URL. */
    posterURL: URLStringSchema.optional().nullable(),

    /** Optional original release date. */
    releaseDate: DateInstanceSchema.optional().nullable(),

    /** List of associated genres. */
    genres: generateArraySchema(
        NonEmptyStringSchema.max(150, "Must be 150 characters or less.")
    ),

    /** Runtime in minutes. */
    runtime: PositiveNumberSchema.lte(500, "Must be 500 or less."),

    /** Production country (ISO 3166-1 alpha-2). */
    country: ISO3166Alpha2CountryCodeSchema,
});

/** Type representing validated movie snapshot input data. */
export type MovieSnapshotInputData =
    z.infer<typeof MovieSnapshotInputSchema>;
