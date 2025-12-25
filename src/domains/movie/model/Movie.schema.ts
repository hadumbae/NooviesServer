import {Schema} from "mongoose";
import {CloudinaryImageSchema} from "../../../shared/model/cloudinary-image/CloudinaryImage.js";
import ISO6391CodeConstant from "../../../shared/constants/language/ISO6391CodeConstant.js";
import ISO3166Alpha2CodeConstant from "../../../shared/constants/country/ISO3166Alpha2CodeConstant.js";
import {URLStringSchema} from "../../../shared/schema/strings/URLStringSchema.js";
import type {MovieSchemaFields} from "./Movie.types.js";

/**
 * Movie mongoose schema.
 *
 * @remarks
 * Defines persistence rules, validation constraints, and indexes
 * for movie documents, including localization, release metadata,
 * media assets, genre relations, and availability state.
 */
export const MovieSchema: Schema<MovieSchemaFields> = new Schema<MovieSchemaFields>({
    /** Primary display title. */
    title: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [250, "Must be 250 characters or less."],
        trim: true,
        required: [true, "Required."],
    },

    /** Original-language title. */
    originalTitle: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [250, "Must be 250 characters or less."],
        trim: true,
    },

    /** Short marketing tagline. */
    tagline: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [100, "Must be 100 characters or less."],
    },

    /** Full plot synopsis. */
    synopsis: {
        type: String,
        trim: true,
        minlength: [1, "Must be at least 1 character."],
        maxlength: [2000, "Must be 2000 characters or less."],
        required: [true, "Synopsis is required."],
    },

    /** Associated genre references. */
    genres: {
        type: [{type: Schema.Types.ObjectId, ref: "Genre"}],
        required: [true, "Genres are required."],
        validate: {
            validator: (arr) =>
                Array.isArray(arr) &&
                new Set(arr.map((id) => id.toString())).size === arr.length,
            message: "Genres must be unique.",
        },
    },

    /** Official release date (required when released). */
    releaseDate: {
        type: Date,
        validate: {
            message: "Released movies must have release dates.",
            validator: function (releaseDate) {
                return !this.isReleased || !!releaseDate;
            },
        },
    },

    /** Release status flag. */
    isReleased: {
        type: Boolean,
        default: false,
    },

    /** Runtime in minutes. */
    runtime: {
        type: Number,
        min: [1, "Must be at least 1 minute."],
        max: [500, "Must be 500 minutes or less."],
        required: [true, "Duration in minutes is required."],
    },

    /** Original spoken language (ISO 639-1). */
    originalLanguage: {
        type: String,
        required: [true, "The original language is required."],
        enum: {values: ISO6391CodeConstant, message: "Invalid ISO 639-1 Code."},
    },

    /** Production country (ISO 3166-1 alpha-2). */
    country: {
        type: String,
        required: [true, "Country is required."],
        enum: {
            values: ISO3166Alpha2CodeConstant,
            message: "Invalid ISO 3166-1 Alpha-2 Code.",
        },
    },

    /** Available audio languages. */
    languages: {
        type: [{type: String, enum: {values: ISO6391CodeConstant}}],
        required: [true, "Languages are required."],
        validate: {
            validator: (arr) => Array.isArray(arr) && new Set(arr).size === arr.length,
            message: "Languages must be unique.",
        },
    },

    /** Available subtitle languages. */
    subtitles: {
        type: [{type: String, enum: {values: ISO6391CodeConstant}}],
        required: [true, "Subtitles are required."],
        validate: {
            validator: (arr) => Array.isArray(arr) && new Set(arr).size === arr.length,
            message: "Subtitles must be unique.",
        },
    },

    /** Poster image asset (Cloudinary). */
    posterImage: {
        type: CloudinaryImageSchema,
        default: null,
    },

    /** Trailer URL. */
    trailerURL: {
        type: String,
        validate: {
            message: "Trailer URL must be a valid URL.",
            validator: (urlString) => {
                if (urlString === undefined || urlString === null) return true;
                if (urlString === "") return false;
                return URLStringSchema.safeParse(urlString).success;
            },
        },
    },

    /** Availability flag. */
    isAvailable: {
        type: Boolean,
        default: true,
    },

    /** URL-friendly unique identifier. */
    slug: {
        type: String,
        unique: [true, "Slug must be unique."],
        required: [true, "Slug is required."],
    },
}, {
    timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"},
});

/** Indexes for common query patterns. */
MovieSchema.index({title: 1});
MovieSchema.index({originalTitle: 1});
MovieSchema.index({releaseDate: -1});
MovieSchema.index({isAvailable: 1});
