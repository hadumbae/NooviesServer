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
import {MovieBaseSchema} from "./MovieBaseSchema.js";

export const MovieSubmitSchema = MovieBaseSchema.extend({
    genres: z
        .array(
            GenreAsyncIDString
        ),

    directors: z
        .array(
            PersonAsyncIDString
        ),

    cast: z
        .array(
            PersonAsyncIDString
        ),
});