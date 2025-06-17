import {z, ZodType} from "zod";
import {GenreAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import type IMovieSubmit from "./interface/IMovieSubmit.js";
import {DateStringSchema} from "../../../shared/schema/date/DateStringSchema.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import {ValidURLStringSchema} from "../../../shared/schema/strings/ValidURLStringSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";

/**
 * Zod schema for validating data submitted when creating or updating a movie.
 *
 * This schema enforces constraints on fields such as title, genres, runtime, and more,
 * based on the {@link IMovieSubmit} interface.
 *
 * @example
 * ```ts
 * const parsed = MovieSubmitSchema.parse(movieFormInput);
 * ```
 */
export const MovieSubmitSchema: ZodType<IMovieSubmit> = z.object({
    /**
     * The movie's main title.
     * Required and must be between 1 and 1000 characters.
     */
    title: RequiredStringSchema
        .min(1, "Title must be at least 1 character long.")
        .max(1000, "Title must be 1000 characters or less."),

    /**
     * The original title of the movie (e.g., in the original language).
     * Required and must be at most 1000 characters.
     */
    originalTitle: RequiredStringSchema.max(1000, "Must be 1000 characters or less."),

    /**
     * A short tagline or slogan for the movie.
     * Optional and must be at most 100 characters.
     */
    tagline: RequiredStringSchema.max(100, "Must be 100 characters or less.").optional(),

    /**
     * A brief synopsis or description of the movie.
     * Required, trimmed, and must not exceed 2000 characters.
     */
    synopsis: RequiredStringSchema.trim().max(2000, "Description must be 2000 characters or less."),

    /**
     * An array of genre IDs the movie belongs to.
     * Must be valid genre references.
     */
    genres: z.array(GenreAsyncIDString),

    /**
     * The movie's release date in string format (e.g., "2025-07-01").
     * Optional and can be null.
     */
    releaseDate: DateStringSchema.optional().nullable(),

    /**
     * The runtime of the movie in minutes.
     * Must be a positive number.
     */
    runtime: PositiveNumberSchema,

    /**
     * The ISO 639-1 code of the movie's original language (e.g., "en", "fr").
     * Required and up to 10 characters.
     */
    originalLanguage: RequiredStringSchema.max(10, "Must be 10 characters or less."),

    /**
     * The country where the movie was produced.
     * Required and must be at most 100 characters.
     */
    country: RequiredStringSchema.max(100, "Must be 100 characters or less."),

    /**
     * A list of spoken languages featured in the film.
     * Optional array of non-empty strings.
     */
    languages: z.array(RequiredStringSchema).optional(),

    /**
     * A list of available subtitle languages for the film.
     * Optional array of non-empty strings.
     */
    subtitles: z.array(RequiredStringSchema).optional(),

    /**
     * The URL to the movie trailer, if available.
     * Can be null.
     */
    trailerURL: ValidURLStringSchema.nullable(),
});