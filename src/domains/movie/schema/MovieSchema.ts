import {z, ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {GenreSchema} from "../../genre/schema/GenreSchema.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import {RequiredStringSchema, ValidURLStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import type IMovie from "../model/IMovie.js";
import {MovieCreditSchema} from "../../movieCredit/schemas/MovieCreditSchema.js";
import {DateStringSchema} from "../../../shared/schema/date/DateStringSchema.js";

export const MovieSchema: ZodType<IMovie> = z.object({
    _id: IDInstance,

    title: RequiredStringSchema
        .max(1000, "Must be 1000 characters or less."),

    originalTitle: RequiredStringSchema
        .max(1000, "Must be 1000 characters or less."),

    tagline: RequiredStringSchema
        .max(100, "Must be 100 characters or less.")
        .optional(),

    synopsis: RequiredStringSchema
        .trim()
        .max(2000, "Must be 2000 characters or less."),

    genres: z.array(z.union([IDInstance, z.lazy(() => GenreSchema)])),

    releaseDate: DateStringSchema.optional().nullable(),

    runtime: PositiveNumber,

    originalLanguage: RequiredStringSchema.max(10, "Must be 10 characters or less."),

    country: RequiredStringSchema.max(100, "Must be 100 characters or less."),

    languages: z.array(RequiredStringSchema),

    subtitles: z.array(RequiredStringSchema),

    cast: z.array(z.lazy(() => MovieCreditSchema), {message: "Must be an array of movie credits."}).optional(),

    crew: z.array(z.lazy(() => MovieCreditSchema), {message: "Must be an array of movie credits."}).optional(),

    posterImage: z.object({public_id: RequiredStringSchema, secure_url: ValidURLStringSchema}).optional().nullable(),

    trailerURL: ValidURLStringSchema.optional().nullable(),

    showings: z.array(z.union([IDInstance, z.lazy(() => ShowingSchema)])),
});

export type ZMovie = z.infer<typeof MovieSchema>