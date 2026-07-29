/**
 * @fileoverview Registers and exports the Mongoose model for movie reviews.
 */

import "@/domains/movie-reviews/_models/review/MovieReview.indexes.js";
import {model, Model} from "mongoose";
import type {MovieReviewSchemaFields} from "@/domains/movie-reviews/_models/review/MovieReview.types.js";
import {MovieReviewSchema} from "@/domains/movie-reviews/_models/review/MovieReview.schema.js";
import "@/domains/movie-reviews/_models/review/MovieReview.hooks";

/**
 * The Mongoose model for interacting with the MovieReview collection.
 */
export const MovieReview: Model<MovieReviewSchemaFields> = model<MovieReviewSchemaFields>(
    "MovieReview",
    MovieReviewSchema,
);