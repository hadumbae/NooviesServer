import {z, ZodType} from "zod";
import {RequiredStringSchema, ValidURLStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {DateStringSchema} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {GenreAsyncIDString, PersonAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import type IMovieSubmit from "./interface/IMovieSubmit.js";

export const MovieSubmitSchema: ZodType<IMovieSubmit> = z.object({
    title: RequiredStringSchema
        .min(1, "Title must be at least 1 character long.")
        .max(1000, "Title must be 1000 characters or less."),

    description: RequiredStringSchema
        .trim()
        .max(2000, "Description must be 2000 characters or less."),

    genres: z.array(GenreAsyncIDString),

    directors: z.array(PersonAsyncIDString),

    cast: z.array(PersonAsyncIDString),

    releaseDate: DateStringSchema.optional().nullable(),

    durationInMinutes: PositiveNumber,

    languages: z.array(RequiredStringSchema).optional(),

    subtitles: z.array(RequiredStringSchema).optional(),

    trailerURL: ValidURLStringSchema.nullable(),

    price: PositiveNumber,
});