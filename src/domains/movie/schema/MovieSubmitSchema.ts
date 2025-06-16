import {z, ZodType} from "zod";
import {RequiredStringSchema, ValidURLStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {GenreAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import type IMovieSubmit from "./interface/IMovieSubmit.js";
import {DateStringSchema} from "../../../shared/schema/date/DateStringSchema.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";

// * originalTitle
// * tagline
// * country
// * originalLanguage

export const MovieSubmitSchema: ZodType<IMovieSubmit> = z.object({
    title: RequiredStringSchema
        .min(1, "Title must be at least 1 character long.")
        .max(1000, "Title must be 1000 characters or less."),

    originalTitle: RequiredStringSchema
        .max(1000, "Must be 1000 characters or less."),

    tagline: RequiredStringSchema
        .max(100, "Must be 100 characters or less.")
        .optional(),

    synopsis: RequiredStringSchema
        .trim()
        .max(2000, "Description must be 2000 characters or less."),

    genres: z.array(GenreAsyncIDString),

    releaseDate: DateStringSchema.optional().nullable(),

    runtime: PositiveNumberSchema,

    originalLanguage: RequiredStringSchema.max(10, "Must be 10 characters or less."),

    country: RequiredStringSchema.max(100, "Must be 100 characters or less."),

    languages: z.array(RequiredStringSchema).optional(),

    subtitles: z.array(RequiredStringSchema).optional(),

    trailerURL: ValidURLStringSchema.nullable(),
});