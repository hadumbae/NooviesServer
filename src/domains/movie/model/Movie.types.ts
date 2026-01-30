import { Types } from "mongoose";
import type { URLString } from "../../../shared/schema/strings/URLStringSchema.js";
import type { ISO6391LanguageCode } from "../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type { CloudinaryImageObject } from "../../../shared/schema/cloudinary/CloudinaryImageObjectSchema.js";
import type { GenreSchemaFields } from "../../genre/model/Genre.types.js";

/**
 * Movie document schema fields.
 *
 * @remarks
 * Represents a persisted movie entity in the catalog. This interface
 * defines the authoritative data model used by the application layer,
 * including identification, localization, release metadata, media
 * assets, and genre relationships.
 *
 * Fields defined here may be transformed into immutable snapshot
 * representations when embedded into reservations, tickets, or
 * historical records.
 */
export interface MovieSchemaFields {
    /** MongoDB document identifier. */
    readonly _id: Types.ObjectId;

    /** Primary display title used for listings and marketing. */
    title: string;

    /** Original-language title, if different from {@link title}. */
    originalTitle?: string;

    /** Optional marketing or promotional tagline. */
    tagline?: string;

    /** Production country (ISO 3166-1 alpha-2). */
    country: string;

    /** Full plot synopsis or description. */
    synopsis: string;

    /**
     * Official release date.
     *
     * @remarks
     * May be null or omitted if the release date is unknown
     * or has not yet been finalized.
     */
    releaseDate?: Date | null;

    /** Indicates whether the movie has been publicly released. */
    isReleased?: boolean;

    /** Runtime in minutes. */
    runtime: number;

    /** Original spoken language of the movie (ISO 639-1). */
    originalLanguage: ISO6391LanguageCode;

    /** Available audio languages. */
    languages: ISO6391LanguageCode[];

    /** Available subtitle languages. */
    subtitles: ISO6391LanguageCode[];

    /**
     * Poster image asset metadata.
     *
     * @remarks
     * Stored as a Cloudinary object when present.
     */
    posterImage?: CloudinaryImageObject | null;

    /**
     * Trailer URL.
     *
     * @remarks
     * Typically points to an external video hosting service.
     */
    trailerURL?: URLString | null;

    /**
     * Associated genres.
     *
     * @remarks
     * May contain either ObjectId references or fully populated
     * genre documents depending on query context.
     */
    genres: (Types.ObjectId | GenreSchemaFields)[];

    /** Indicates whether the movie is currently available for booking. */
    isAvailable?: boolean;

    /** URL-friendly unique identifier. */
    slug: string;
}
