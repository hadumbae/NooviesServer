/**
 * @file MovieReview model registration.
 * MovieReview.model.ts
 */

import "src/domains/movie-reviews/_models/review/MovieReview.indexes.js";
import {model, Model} from "mongoose";
import type {MovieReviewSchemaFields} from "@/domains/movie-reviews/_models/review/MovieReview.types.js";
import {MovieReviewSchema} from "@/domains/movie-reviews/_models/review/MovieReview.schema.js";
import "src/domains/movie-reviews/_models/review/MovieReview.hooks";

/**
 * Mongoose model for MovieReview documents.
 */
export const MovieReview: Model<MovieReviewSchemaFields> = model<MovieReviewSchemaFields>(
    "MovieReview",
    MovieReviewSchema,
);