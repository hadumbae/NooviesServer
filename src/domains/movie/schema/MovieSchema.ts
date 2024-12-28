import {z, ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {GenreSchema} from "../../genre/schema/GenreSchema.js";
import {PersonSchema} from "../../person/schema/PersonSchema.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import type {IMovie} from "../model/MovieModel.js";
import {IDString, RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedDate} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";

export const MovieSchema: ZodType<IMovie> = z.object({
    _id: z
        .union([IDInstance, IDString])
        .optional(),

    title: RequiredString
        .min(1, "Title must be at least 1 character long.")
        .max(1000, "Title must be 1000 characters or less."),

    description: RequiredString
        .trim()
        .max(2000, "Description must be 2000 characters or less."),

    genres: z
        .array(z.union([
            IDInstance,
            IDString,
            z.lazy(() => GenreSchema),
        ])),

    directors: z
        .array(z.union([
            IDInstance,
            IDString,
            z.lazy(() => PersonSchema),
        ]))
        .optional(),

    cast: z
        .array(z.union([
            IDInstance,
            IDString,
            z.lazy(() => PersonSchema),
        ]))
        .optional(),

    releaseDate: z
        .union([
            z.null(),
            CoercedDate,
        ])
        .optional(),

    durationInMinutes: PositiveNumber,

    languages: z
        .array(RequiredString)
        .optional(),

    subtitles: z
        .array(RequiredString)
        .optional(),

    trailerURL: z
        .union([
            z.null(),
            RequiredString.url({message: "Must be a valid URL."}),
        ])
        .optional(),

    price: PositiveNumber,

    showings: z
        .array(z.union([
            IDInstance,
            z.lazy(() => ShowingSchema),
        ]))
        .optional(),
});