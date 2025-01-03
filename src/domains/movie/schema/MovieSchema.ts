import {z, ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {GenreSchema} from "../../genre/schema/GenreSchema.js";
import {PersonSchema} from "../../person/schema/PersonSchema.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import {RequiredString, URLString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedDate} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import type IMovie from "../model/IMovie.js";

export const MovieSchema: ZodType<IMovie> = z.object({
    _id: IDInstance,

    title: RequiredString
        .min(1, "Title must be at least 1 character long.")
        .max(1000, "Title must be 1000 characters or less."),

    description: RequiredString
        .trim()
        .max(2000, "Description must be 2000 characters or less."),

    genres: z
        .array(z.union([IDInstance, z.lazy(() => GenreSchema)])),

    directors: z
        .array(z.union([IDInstance,z.lazy(() => PersonSchema)])),

    cast: z
        .array(z.union([IDInstance, z.lazy(() => PersonSchema)])),

    releaseDate: z
        .union([z.null(), CoercedDate])
        .optional(),

    durationInMinutes: PositiveNumber,

    languages: z
        .array(RequiredString),

    subtitles: z
        .array(RequiredString),

    posterImage: z
        .object({
            public_id: RequiredString,
            secure_url: URLString,
        }),

    trailerURL: z
        .union([z.null(), URLString]),

    price: PositiveNumber,

    showings: z
        .array(z.union([IDInstance, z.lazy(() => ShowingSchema)])),
});

export type ZMovie = z.infer<typeof MovieSchema>