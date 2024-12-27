import {z, ZodType} from 'zod';
import type {IMovie} from "../model/MovieModel.js";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {IDString, RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {GenreSchema} from "../../genre/schema/GenreSchema.js";
import {PersonSchema} from "../../person/schema/PersonSchema.js";
import {CoercedDate} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {CloudinaryImageObject} from "../../../shared/schema/helpers/ZodImageHelpers.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import Genre from "../../genre/model/GenreModel.js";
import {GenreAsyncIDString, PersonAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";

export const MovieBaseSchema = z.object({
    title: RequiredString
        .min(1, "Title must be at least 1 character long.")
        .max(1000, "Title must be 1000 characters or less."),

    description: RequiredString
        .trim()
        .max(2000, "Description must be 2000 characters or less."),

    releaseDate: z
        .union([z.null(), CoercedDate])
        .optional(),

    durationInMinutes: PositiveNumber,

    languages: z
        .array(RequiredString),

    subtitles: z
        .array(RequiredString),

    posterImage: z
        .union([z.null(), CloudinaryImageObject])
        .optional(),

    trailerURL: z
        .union([z.null(), RequiredString.url({message: "Must be a valid URL."})])
        .optional(),

    price: PositiveNumber,
});