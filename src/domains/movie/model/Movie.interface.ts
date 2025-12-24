import {Types} from "mongoose";
import type {URLString} from "../../../shared/schema/strings/URLStringSchema.js";
import type {ISO6391LanguageCode} from "../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type {CloudinaryImageObject} from "../../../shared/schema/cloudinary/CloudinaryImageObjectSchema.js";

/**
 * Interface representing a Movie document.
 *
 * @remarks
 * Defines the structure and types of a movie in the system, including metadata,
 * release details, runtime, language, subtitles, media assets, and genres.
 */
export default interface IMovie {
    /**
     * Unique identifier for the movie.
     * @readonly
     * @type {Types.ObjectId}
     */
    readonly _id: Types.ObjectId;

    /**
     * The main title of the movie.
     * @type {string}
     * @required
     */
    title: string;

    /**
     * The original title of the movie (often in the original language).
     * @type {string}
     * @optional
     */
    originalTitle?: string;

    /**
     * Optional tagline or slogan for the movie.
     * @type {string}
     * @optional
     */
    tagline?: string;

    /**
     * ISO 3166-1 Alpha-2 code representing the production country.
     * @type {string}
     * @required
     */
    country: string;

    /**
     * Full synopsis of the movie's plot.
     * @type {string}
     * @required
     */
    synopsis: string;

    /**
     * Official release date of the movie.
     * @type {Date | null}
     * @optional
     */
    releaseDate?: Date | null;

    /**
     * Whether the movie has been released.
     * @type {boolean}
     * @optional
     * @default false
     */
    isReleased?: boolean;

    /**
     * Duration of the movie in minutes.
     * @type {number}
     * @required
     */
    runtime: number;

    /**
     * The original language of the movie (ISO 639-1 code).
     * @type {ISO6391LanguageCode}
     * @required
     */
    originalLanguage: ISO6391LanguageCode;

    /**
     * List of available languages in the movie (ISO 639-1 codes).
     * @type {ISO6391LanguageCode[]}
     * @required
     */
    languages: ISO6391LanguageCode[];

    /**
     * List of subtitle languages available for the movie (ISO 639-1 codes).
     * @type {ISO6391LanguageCode[]}
     * @required
     */
    subtitles: ISO6391LanguageCode[];

    /**
     * Optional poster image for the movie.
     * @type {CloudinaryImageObject | null}
     * @optional
     */
    posterImage?: CloudinaryImageObject | null;

    /**
     * Optional trailer URL for the movie.
     * @type {URLString | null}
     * @optional
     */
    trailerURL?: URLString | null;

    /**
     * List of genres the movie belongs to (referenced by ObjectId).
     * @type {Types.ObjectId[]}
     * @required
     */
    genres: Types.ObjectId[];

    /**
     * Whether the movie is currently available for viewing.
     * @type {boolean}
     * @optional
     * @default true
     */
    isAvailable?: boolean;
}
