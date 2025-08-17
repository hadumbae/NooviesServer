import {z, ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {GenreInputSchema} from "../../genre/schema/GenreInputSchema.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import type IMovie from "../model/Movie.interface.js";
import {MovieCreditSchema} from "../../movieCredit/schemas/MovieCreditSchema.js";
import {DateStringSchema} from "../../../shared/schema/date/DateStringSchema.js";
import {CloudinaryImageObjectSchema} from "../../../shared/schema/cloudinary/CloudinaryImageObjectSchema.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import {ValidURLStringSchema} from "../../../shared/schema/strings/ValidURLStringSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";

/**
 * Raw Zod schema definition for a movie object.
 *
 * This schema describes the structure and validation logic for movie data, including:
 * - Titles, language, runtime, country
 * - Nested arrays of genres, cast, crew, and showings
 * - Optional fields such as tagline, trailer URL, and poster image
 *
 * It is used as the base schema before applying a strong type cast with `IMovie`.
 */
export const MovieRawSchema = z.object({
    /** Unique identifier of the movie (ObjectId) */
    _id: IDInstance,

    /** English or localized display title */
    title: RequiredStringSchema.max(1000, "Must be 1000 characters or less."),

    /** Original title of the movie, typically in the source language */
    originalTitle: RequiredStringSchema.max(1000, "Must be 1000 characters or less."),

    /** Short tagline or slogan for the movie */
    tagline: RequiredStringSchema.max(100, "Must be 100 characters or less.").optional(),

    /** Full plot synopsis or description */
    synopsis: RequiredStringSchema.trim().max(2000, "Must be 2000 characters or less."),

    /**
     * An array of genre references or embedded genre documents
     * Accepts both ID references and fully populated genre schemas
     */
    genres: z.array(z.union([IDInstance, z.lazy(() => GenreInputSchema)])),

    /** Optional release date (ISO string), nullable */
    releaseDate: DateStringSchema.optional().nullable(),

    /** Runtime of the movie in minutes */
    runtime: PositiveNumberSchema,

    /** Original language code (e.g. "en", "ja") */
    originalLanguage: RequiredStringSchema.max(10, "Must be 10 characters or less."),

    /** Country of origin (e.g. "United States") */
    country: RequiredStringSchema.max(100, "Must be 100 characters or less."),

    /** List of spoken languages in the film */
    languages: z.array(RequiredStringSchema),

    /** List of available subtitle languages */
    subtitles: z.array(RequiredStringSchema),

    /**
     * Optional array of cast members (movie credits).
     *
     * This is a Mongoose virtual field and may not exist in the raw database document
     * unless it has been populated. Each item must conform to `MovieCreditSchema`.
     */
    cast: z.array(z.lazy(() => MovieCreditSchema), {
        message: "Must be an array of movie credits.",
    }).optional(),

    /**
     * Optional array of crew members (movie credits).
     *
     * This is a Mongoose virtual field and may not exist in the raw database document
     * unless it has been populated. Each item must conform to `MovieCreditSchema`.
     */
    crew: z.array(z.lazy(() => MovieCreditSchema), {
        message: "Must be an array of movie credits.",
    }).optional(),

    /** Optional Cloudinary image object for the poster; nullable */
    posterImage: CloudinaryImageObjectSchema.optional().nullable(),

    /** Optional trailer video URL; must be a valid URL string */
    trailerURL: ValidURLStringSchema.optional().nullable(),

    /**
     * An array of showings for this movie.
     * Can contain ObjectId references or full `ShowingSchema` objects.
     */
    showings: z.array(z.union([IDInstance, z.lazy(() => ShowingSchema)])),
});

/**
 * Strongly typed movie schema using the `IMovie` interface.
 *
 * This enforces type alignment at compile time while preserving
 * full Zod runtime validation support.
 */
export const MovieSchema = MovieRawSchema as ZodType<IMovie>;

/**
 * Inferred Zod type representing a validated movie object.
 *
 * Equivalent to `IMovie`, but derived directly from the schema.
 */
export type ZMovie = z.infer<typeof MovieSchema>