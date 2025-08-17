import {Types} from "mongoose";
import type ICloudinaryImage from "../../../shared/model/cloudinary-image/ICloudinaryImage.js";
import type {ValidURLString} from "../../../shared/schema/strings/ValidURLStringSchema.js";
import type {ISO6391Code} from "../../../shared/schema/enums/language/ISO6391CodeEnumSchema.js";

/**
 * Represents a movie in the system.
 *
 * @remarks
 * This interface defines the structure of a movie document, including core metadata,
 * release details, languages, subtitles, associated media, and genre references.
 */
export default interface IMovie {
    /**
     * Unique identifier for the movie.
     * @readonly
     */
    readonly _id: Types.ObjectId;

    /**
     * The main title of the movie.
     */
    title: string;

    /**
     * The original title of the movie, usually in its original language.
     */
    originalTitle: string;

    /**
     * Optional tagline or slogan for the movie.
     */
    tagline?: string;

    /**
     * ISO 3166-1 Alpha-2 country code representing the production country.
     */
    country: string;

    /**
     * Full synopsis of the movie's plot.
     */
    synopsis: string;

    /**
     * Official release date of the movie, if available.
     */
    releaseDate?: Date | null;

    /**
     * Whether the movie has been released.
     * @default false
     */
    isReleased?: boolean;

    /**
     * Duration of the movie in minutes.
     */
    runtime: number;

    /**
     * The original language of the movie (ISO 639-1 code).
     */
    originalLanguage: ISO6391Code;

    /**
     * List of available languages in the movie (ISO 639-1 codes).
     */
    languages: ISO6391Code[];

    /**
     * List of subtitle languages available for the movie (ISO 639-1 codes).
     */
    subtitles: ISO6391Code[];

    /**
     * Optional poster image for the movie.
     */
    posterImage?: ICloudinaryImage | null;

    /**
     * Optional trailer URL for the movie.
     */
    trailerURL?: ValidURLString | null;

    /**
     * List of genres the movie belongs to (referenced by ObjectId).
     */
    genres: Types.ObjectId[];

    /**
     * Whether the movie is currently available for viewing.
     * @default true
     */
    isAvailable?: boolean;
}

