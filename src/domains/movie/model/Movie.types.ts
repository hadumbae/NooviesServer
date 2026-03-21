/**
 * @file Persistence and variant types for Movie documents.
 * @filename Movie.types.ts
 */

import {Types} from "mongoose";
import type {URLString} from "../../../shared/schema/strings/URLStringSchema.js";
import type {ISO6391LanguageCode} from "../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type {CloudinaryImageObject} from "../../../shared/schema/cloudinary/CloudinaryImageObjectSchema.js";
import type {GenreSchemaFields} from "../../genre/model/Genre.types.js";

/**
 * Interface representing the comprehensive shape of a Movie document in the database.
 */
export interface MovieSchemaFields {
    /** Unique MongoDB document identifier. */
    readonly _id: Types.ObjectId;

    /** Primary display title used for catalog listings. */
    title: string;

    /** Original-language title; useful for foreign cinema entries. */
    originalTitle?: string;

    /** Optional marketing tagline or short promotional hook. */
    tagline?: string;

    /** Production country code (ISO 3166-1 alpha-2). */
    country: string;

    /** Comprehensive plot summary or description. */
    synopsis: string;

    /**
     * Official release date.
     * * @remarks
     * Can be `null` or `undefined` if the movie is in pre-production or the date is TBD.
     */
    releaseDate?: Date | null;

    /** Boolean flag indicating if the movie has passed its release window. */
    isReleased?: boolean;

    /** Total duration of the film in minutes. */
    runtime: number;

    /** Primary spoken language of the source material (ISO 639-1). */
    originalLanguage: ISO6391LanguageCode;

    /** List of available audio tracks by language code. */
    languages: ISO6391LanguageCode[];

    /** List of available subtitle tracks by language code. */
    subtitles: ISO6391LanguageCode[];

    /**
     * Metadata for the movie's poster asset.
     * * @remarks
     * Points to a {@link CloudinaryImageObject} containing secure URLs and dimensions.
     */
    posterImage?: CloudinaryImageObject | null;

    /**
     * Direct link to a hosted trailer (e.g., YouTube, Vimeo).
     */
    trailerURL?: URLString | null;

    /**
     * Associated movie categories.
     * * @remarks
     * Polymorphic field that holds either raw `ObjectId` references or
     * resolved {@link GenreSchemaFields} documents.
     */
    genres: (Types.ObjectId | GenreSchemaFields)[];

    /** Administrative flag to enable/disable public booking or visibility. */
    isAvailable?: boolean;

    /** Unique, URL-safe string derived from the title for routing. */
    slug: string;
}

/**
 * Specialized type representing a Movie where the `genres` field is guaranteed
 * to be an array of fully populated {@link GenreSchemaFields} objects.
 */
export type MovieWithGenres = Omit<MovieSchemaFields, "genres"> & {
    /** Fully resolved genre documents. */
    genres: GenreSchemaFields[];
};

/**
 * Specialized type for analytical or display views, extending {@link MovieWithGenres}
 * with a calculated rating metric.
 */
export type MovieWithRating = MovieWithGenres & {
    /** Calculated average score from 0 to 5 based on user reviews. */
    averageRating: number;
};