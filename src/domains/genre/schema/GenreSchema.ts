import {z, type ZodType} from 'zod';
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {MovieSchema} from "../../movie/schema/MovieSchema.js";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import type IGenre from "../model/IGenre.js";

export const GenreSchema: ZodType<IGenre> = z.object({
    _id: IDInstance,

    name: RequiredStringSchema
        .min(3, "Must be 3 characters or longer.")
        .max(255, "Must be 255 characters or less."),

    description: RequiredStringSchema
        .max(1000, "Must be 1000 characters or less."),

    movies: z
        .array(z.union([IDInstance, z.lazy(() => MovieSchema)])),
});

export type ZGenre = z.infer<typeof GenreSchema>;