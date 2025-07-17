import {Types} from "mongoose";
import type IGenre from "../../genre/model/IGenre.js";
import type IShowing from "../../showing/model/IShowing.js";
import type ICloudinaryImage from "../../../shared/model/cloudinary-image/ICloudinaryImage.js";
import type {IMovieCredit} from "../../movieCredit/models/IMovieCredit.js";

/**
 * Interface representing a movie entity, including metadata,
 * relational references (genres, credits, showings), and media details.
 */
export default interface IMovie {
    /**
     * Unique MongoDB ObjectId of the movie.
     */
    readonly _id: Types.ObjectId;

    /**
     * The movie's display title.
     */
    title: string;

    /**
     * The movie's original title (e.g., in the original language or country).
     */
    originalTitle: string;

    /**
     * A short promotional tagline or slogan.
     */
    tagline?: string;

    /**
     * The country where the movie was produced.
     */
    country: string;

    /**
     * A brief synopsis or description of the movie's plot.
     */
    synopsis: string;

    /**
     * List of genres the movie belongs to.
     * Can be either genre IDs or populated genre objects.
     */
    genres: (Types.ObjectId | IGenre)[];

    /**
     * List of crew members associated with the movie.
     * Each item is a movie credit with roleType "CREW".
     */
    crew?: IMovieCredit[];

    /**
     * List of cast members who acted in the movie.
     * Each item is a movie credit with roleType "CAST".
     */
    cast?: IMovieCredit[];

    /**
     * Release date in ISO string format (e.g., "2025-06-01").
     * Can be null or undefined if not released yet.
     */
    releaseDate?: string | null;

    /**
     * Runtime of the movie in minutes.
     */
    runtime: number;

    /**
     * ISO 639-1 language code of the movie's original language (e.g., "en").
     */
    originalLanguage: string;

    /**
     * Array of ISO 639-1 codes for languages spoken in the movie.
     */
    languages: string[];

    /**
     * Array of ISO 639-1 codes for subtitle languages available.
     */
    subtitles: string[];

    /**
     * Poster image metadata for the movie.
     * Optional; can be null if no image is uploaded.
     */
    posterImage?: ICloudinaryImage | null;

    /**
     * URL to the movie trailer (e.g., YouTube link).
     * Optional; can be null.
     */
    trailerURL?: string | null;

    /**
     * List of showings (screenings) scheduled for this movie.
     * Can be showing IDs or populated showing objects.
     */
    showings: (Types.ObjectId | IShowing)[];
}

