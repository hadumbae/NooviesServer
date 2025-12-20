/**
 * @file MovieSnapshotSchemaFields.ts
 *
 * @summary
 * Defines the snapshot structure of a movie for storage in other entities.
 */

import type { ISO3166Alpha2CountryCode } from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";

/**
 * Fields representing a movie snapshot.
 *
 * Used for storing a movie’s state at a given point in time (e.g., in showings, reservations).
 */
export interface MovieSnapshotSchemaFields {
    /** Movie title in the current locale */
    title: string;

    /** Original title of the movie */
    originalTitle: string;

    /** Optional tagline or slogan for the movie */
    tagline?: string;

    /** Optional URL to the movie poster image */
    posterURL?: string;

    /** Array of genre strings (e.g., ["Action", "Comedy"]) */
    genres: string[];

    /** Country code (ISO 3166-1 alpha-2) representing the production country */
    country: ISO3166Alpha2CountryCode;

    /** Optional release date of the movie */
    releaseDate?: Date | null;

    /** Runtime of the movie in minutes */
    runtime: number;
}
