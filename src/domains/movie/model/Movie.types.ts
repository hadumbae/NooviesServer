import {Types} from "mongoose";
import type {URLString} from "../../../shared/schema/strings/URLStringSchema.js";
import type {ISO6391LanguageCode} from "../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type {CloudinaryImageObject} from "../../../shared/schema/cloudinary/CloudinaryImageObjectSchema.js";

/**
 * Movie document schema fields.
 *
 * @remarks
 * Represents a persisted movie entity, including identification,
 * localization, release metadata, media assets, and genre relations.
 */
export interface MovieSchemaFields {
    /** MongoDB document identifier. */
    readonly _id: Types.ObjectId;

    /** Primary display title. */
    title: string;

    /** Original-language title. */
    originalTitle?: string;

    /** Optional marketing tagline. */
    tagline?: string;

    /** Production country (ISO 3166-1 alpha-2). */
    country: string;

    /** Full plot synopsis. */
    synopsis: string;

    /** Official release date, if known. */
    releaseDate?: Date | null;

    /** Indicates whether the movie has been released. */
    isReleased?: boolean;

    /** Runtime in minutes. */
    runtime: number;

    /** Original spoken language (ISO 639-1). */
    originalLanguage: ISO6391LanguageCode;

    /** Available audio languages. */
    languages: ISO6391LanguageCode[];

    /** Available subtitle languages. */
    subtitles: ISO6391LanguageCode[];

    /** Poster image asset. */
    posterImage?: CloudinaryImageObject | null;

    /** Trailer URL. */
    trailerURL?: URLString | null;

    /** Associated genre references. */
    genres: Types.ObjectId[];

    /** Indicates whether the movie is currently available. */
    isAvailable?: boolean;

    /** URL-friendly unique identifier. */
    slug: string;
}
