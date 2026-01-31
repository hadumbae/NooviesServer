/**
 * @file MovieSnapshot.types.ts
 *
 * Immutable field definitions for a movie snapshot.
 *
 * Used to embed a movie’s resolved state into other documents such as
 * showings and reservations.
 */

import type { ISO3166Alpha2CountryCode } from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";

/**
 * Immutable snapshot of a movie at a specific point in time.
 *
 * @remarks
 * Values must remain unchanged for the lifetime of the parent document.
 */
export interface MovieSnapshotSchemaFields {
    /** Localized display title of the movie. */
    title: string;

    /** Original release title. */
    originalTitle: string;

    /** Optional marketing tagline. */
    tagline?: string | null;

    /** Optional poster image URL. */
    posterURL?: string | null;

    /** List of associated genres. */
    genres: string[];

    /** Production country (ISO 3166-1 alpha-2). */
    country: ISO3166Alpha2CountryCode;

    /** Original release date, if known. */
    releaseDate?: Date | null;

    /** Runtime in minutes. */
    runtime: number;
}
