/**
 * @fileoverview Persistence and variant types for Movie documents.
 *
 */

import {Types} from "mongoose";
import type {URLString} from "src/shared/schema/strings/URLStringSchema.js";
import type {ISO6391LanguageCode} from "src/shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type {CloudinaryImageObject} from "src/shared/schema/cloudinary/CloudinaryImageObjectSchema.js";
import type {GenreSchemaFields} from "src/domains/genre/models/genre/Genre.types.js";

/**
 * Comprehensive shape of a Movie document in the database.
 */
export type MovieSchemaFields = {
    readonly _id: Types.ObjectId;
    title: string;
    originalTitle?: string;
    tagline?: string;
    country: string;
    synopsis: string;
    releaseDate?: Date | null;
    isReleased?: boolean;
    runtime: number;
    originalLanguage: ISO6391LanguageCode;
    languages: ISO6391LanguageCode[];
    subtitles: ISO6391LanguageCode[];
    posterImage?: CloudinaryImageObject | null;
    trailerURL?: URLString | null;
    genres: (Types.ObjectId | GenreSchemaFields)[];
    isAvailable?: boolean;
    slug: string;
}

/**
 * Movie type where the genres field is guaranteed to be an array of fully populated Genre documents.
 */
export type MovieWithGenres = Omit<MovieSchemaFields, "genres"> & {
    genres: GenreSchemaFields[];
};

/**
 * Movie type extending MovieWithGenres with a calculated average rating metric.
 */
export type MovieWithRating = MovieWithGenres & {
    averageRating: number;
};