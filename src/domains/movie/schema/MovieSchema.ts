import {z, ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {GenreSchema} from "../../genre/schema/GenreSchema.js";
import {PersonSchema} from "../../person/schema/PersonSchema.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import {RequiredStringSchema, ValidURLStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {DateStringSchema} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import type IMovie from "../model/IMovie.js";

export const MovieSchema: ZodType<IMovie> = z.object({
    _id: IDInstance,

    title: RequiredStringSchema
        .min(1, "Title must be at least 1 character long.")
        .max(1000, "Title must be 1000 characters or less."),

    description: RequiredStringSchema.trim().max(2000, "Description must be 2000 characters or less."),

    genres: z.array(z.union([IDInstance, z.lazy(() => GenreSchema)])),

    directors: z.array(z.union([IDInstance, z.lazy(() => PersonSchema)])),

    cast: z.array(z.union([IDInstance, z.lazy(() => PersonSchema)])),

    releaseDate: DateStringSchema.optional().nullable(),

    durationInMinutes: PositiveNumber,

    languages: z.array(RequiredStringSchema),

    subtitles: z.array(RequiredStringSchema),

    posterImage: z.object({public_id: RequiredStringSchema, secure_url: ValidURLStringSchema}).optional().nullable(),

    trailerURL: ValidURLStringSchema.optional().nullable(),

    price: PositiveNumber,

    showings: z.array(z.union([IDInstance, z.lazy(() => ShowingSchema)])),
});

export type ZMovie = z.infer<typeof MovieSchema>