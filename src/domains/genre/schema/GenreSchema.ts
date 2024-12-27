import {z, type ZodType} from 'zod';
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {Types} from "mongoose";
import {MovieSchema} from "../../movie/schema/MovieSchema.js";
import type {IGenre} from "../model/GenreModel.js";

export const GenreSchema: ZodType<IGenre> = z.object({
    _id: z
        .instanceof(Types.ObjectId),

    name: RequiredString
        .min(3, "Must be 3 characters or longer.")
        .max(255, "Must be 255 characters or less."),

    description: RequiredString
        .max(1000, "Must be 1000 characters or less."),

    movies: z.array(z.union([
        z.instanceof(Types.ObjectId),
        z.lazy(() => MovieSchema),
    ])),
});

export type ZGenre = z.infer<typeof GenreSchema>;