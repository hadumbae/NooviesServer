import {z, ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {GenreSchema} from "../../genre/schema/GenreSchema.js";
import {PersonSchema} from "../../person/schema/PersonSchema.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import type {IMovie} from "../model/MovieModel.js";
import {MovieBaseSchema} from "./MovieBaseSchema.js";

export const MovieSchema: ZodType<IMovie> = MovieBaseSchema.extend({
    _id: IDInstance,

    genres: z
        .array(z.union([
            IDInstance,
            z.lazy(() => GenreSchema)
        ])),

    directors: z
        .array(z.union([
            IDInstance,
            z.lazy(() => PersonSchema),
        ])),

    cast: z
        .array(z.union([
            IDInstance,
            z.lazy(() => PersonSchema),
        ])),

    showings: z
        .array(z.union([
            IDInstance,
            z.lazy(() => ShowingSchema),
        ])),
});