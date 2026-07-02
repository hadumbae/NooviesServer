/**
 * @fileoverview Defines the Mongoose model for movie credits.
 */

import {model, type Model} from "mongoose";
import type {MovieCreditSchemaFields} from "@/domains/movie-credits/_models/credit/MovieCredit.types";
import {MovieCreditSchema} from "@/domains/movie-credits/_models/credit/MovieCredit.schema.js";

import "./MovieCredit.middleware.js";

/** Mongoose model for MovieCredit documents representing cast or crew roles in a movie. */
const MovieCredit: Model<MovieCreditSchemaFields> = model<MovieCreditSchemaFields>("MovieCredit", MovieCreditSchema);

export default MovieCredit;