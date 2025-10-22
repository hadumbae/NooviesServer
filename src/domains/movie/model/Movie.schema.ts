import {Schema} from "mongoose";
import type IMovie from "./Movie.interface.js";
import {CloudinaryImageSchema} from "../../../shared/model/cloudinary-image/CloudinaryImage.js";
import ISO6391CodeConstant from "../../../shared/constants/language/ISO6391CodeConstant.js";
import ISO3166Alpha2CodeConstant from "../../../shared/constants/country/ISO3166Alpha2CodeConstant.js";
import {URLStringSchema} from "../../../shared/schema/strings/URLStringSchema.js";

/**
 * Mongoose schema representing a Movie document.
 *
 * Core movie info including titles, synopsis, genres, release info, runtime,
 * language, country, images, trailer URL, and availability.
 */
export const MovieSchema: Schema<IMovie> = new Schema<IMovie>({
    /**
     * Main title of the movie.
     * @type {string}
     * @required
     * @minLength 1
     * @maxLength 250
     * @trim Removes leading/trailing whitespace
     */
    title: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [250, "Must be 250 characters or less."],
        trim: true,
        required: [true, "Required."],
    },

    /**
     * Original title of the movie (often in the original language).
     * @type {string}
     * @optional
     * @minLength 1
     * @maxLength 250
     * @trim Removes leading/trailing whitespace
     */
    originalTitle: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [250, "Must be 250 characters or less."],
        trim: true,
    },

    /**
     * Short tagline or slogan for the movie.
     * @type {string}
     * @optional
     * @maxLength 100
     * @trim Removes leading/trailing whitespace
     */
    tagline: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [100, "Must be 100 characters or less."],
    },

    /**
     * Full synopsis of the movie.
     * @type {string}
     * @required
     * @maxLength 2000
     * @trim Removes leading/trailing whitespace
     */
    synopsis: {
        type: String,
        trim: true,
        minlength: [1, "Must be at least 1 character."],
        maxlength: [2000, "Must be 2000 characters or less."],
        required: [true, "Synopsis is required."],
    },

    /**
     * List of genres (ObjectId references).
     * @type {ObjectId[]}
     * @required
     * @uniqueItems true
     */
    genres: {
        type: [{type: Schema.Types.ObjectId, ref: "Genre"}],
        required: [true, "Genres are required."],
        validate: {
            validator: (arr) => Array.isArray(arr) && new Set(arr.map(id => id.toString())).size === arr.length,
            message: "Genres must be unique.",
        },
    },

    /**
     * Official release date.
     * @type {Date}
     * @optional
     * @customValidator Required if `isReleased` is true
     */
    releaseDate: {
        type: Date,
        validate: {
            message: "Released movies must have release dates.",
            validator: function (releaseDate) {
                return !this.isReleased || !!releaseDate;
            },
        },
    },

    /**
     * Whether the movie has been released.
     * @type {boolean}
     * @default false
     */
    isReleased: {
        type: Boolean,
        default: false,
    },

    /**
     * Runtime in minutes.
     * @type {number}
     * @required
     * @min 1
     * @max 500
     */
    runtime: {
        type: Number,
        min: [1, "Must be at least 1 minute."],
        max: [500, "Must be 500 minutes or less."],
        required: [true, "Duration in minutes is required."],
    },

    /**
     * Original language (ISO 639-1 code).
     * @type {string}
     * @required
     * @enum ISO6391CodeConstant
     */
    originalLanguage: {
        type: String,
        required: [true, "The original language is required."],
        enum: {values: ISO6391CodeConstant, message: "Invalid ISO 639-1 Code."},
    },

    /**
     * Primary production country (ISO 3166-1 Alpha-2 code).
     * @type {string}
     * @required
     * @enum ISO3166Alpha2CodeConstant
     */
    country: {
        type: String,
        required: [true, "Country is required."],
        enum: {values: ISO3166Alpha2CodeConstant, message: "Invalid ISO 3166-1 Alpha-2 Code."},
    },

    /**
     * Audio languages (ISO 639-1 codes).
     * @type {string[]}
     * @required
     * @uniqueItems true
     */
    languages: {
        type: [{type: String, enum: {values: ISO6391CodeConstant, message: "Invalid ISO 639-1 Code"}}],
        required: [true, "Languages are required."],
        validate: {
            validator: (arr) => Array.isArray(arr) && new Set(arr).size === arr.length,
            message: "Languages must be unique.",
        },
    },

    /**
     * Subtitle languages (ISO 639-1 codes).
     * @type {string[]}
     * @required
     * @uniqueItems true
     */
    subtitles: {
        type: [{type: String, enum: {values: ISO6391CodeConstant, message: "Invalid ISO 639-1 Code"}}],
        required: [true, "Subtitles are required."],
        validate: {
            validator: (arr) => Array.isArray(arr) && new Set(arr).size === arr.length,
            message: "Subtitles must be unique.",
        },
    },

    /**
     * Poster image (Cloudinary).
     * @type {CloudinaryImageSchema | null}
     * @default null
     */
    posterImage: {
        type: CloudinaryImageSchema,
        default: null,
    },

    /**
     * Trailer URL.
     * @type {string}
     * @optional
     * @customValidator Valid URL format
     */
    trailerURL: {
        type: String,
        validate: {
            message: "Trailer URL must be a valid URL.",
            validator: (urlString) => {
                if (urlString === undefined || urlString === null) return true;
                if (urlString === "") return false;
                const {success} = URLStringSchema.safeParse(urlString);
                return success;
            },
        },
    },

    /**
     * Whether the movie is available.
     * @type {boolean}
     * @default true
     */
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"}});

/** Indexes for optimized queries */
MovieSchema.index({title: 1});
MovieSchema.index({originalTitle: 1});
MovieSchema.index({releaseDate: -1});
MovieSchema.index({isAvailable: 1});
