import {z, ZodType} from "zod";
import {RequiredString, URLString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedDate} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {GenreAsyncIDString, PersonAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import type IMovieSubmit from "./interface/IMovieSubmit.js";

export const MovieSubmitSchema: ZodType<IMovieSubmit> = z.object({
    title: RequiredString
        .min(1, "Title must be at least 1 character long.")
        .max(1000, "Title must be 1000 characters or less."),

    description: RequiredString
        .trim()
        .max(2000, "Description must be 2000 characters or less."),

    genres: z
        .array(GenreAsyncIDString),

    directors: z
        .array(PersonAsyncIDString),

    cast: z
        .array(PersonAsyncIDString),

    releaseDate: z
        .union([z.null(), CoercedDate])
        .optional(),

    durationInMinutes: PositiveNumber,

    languages: z
        .array(RequiredString)
        .optional(),

    subtitles: z
        .array(RequiredString)
        .optional(),

    trailerURL: z
        .union([z.null(), URLString]),

    price: PositiveNumber,
});