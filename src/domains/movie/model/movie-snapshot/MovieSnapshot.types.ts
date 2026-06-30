/**
 * @fileoverview Immutable field definitions for a movie snapshot used to embed movie states into other documents.
 */

import type { ISO3166Alpha2CountryCode } from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";

/** Immutable snapshot of a movie at a specific point in time. */
export type MovieSnapshotSchemaFields = {
    title: string;
    originalTitle: string;
    tagline?: string | null;
    posterURL?: string | null;
    genres: string[];
    country: ISO3166Alpha2CountryCode;
    releaseDate?: Date | null;
    runtime: number;
}
