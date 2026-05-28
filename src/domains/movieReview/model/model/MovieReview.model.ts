/**
 * @file MovieReview model registration.
 * MovieReview.model.ts
 */

import "src/domains/movieReview/model/model/MovieReview.indexes.js";
import {model, Model} from "mongoose";
import type {MovieReviewSchemaFields} from "@domains/movieReview/model/model/MovieReview.types.js";
import {MovieReviewSchema} from "@domains/movieReview/model/model/MovieReview.schema.js";
import "src/domains/movieReview/model/model/MovieReview.hooks";

/**
 * Mongoose model for MovieReview documents.
 */
export const MovieReview: Model<MovieReviewSchemaFields> = model<MovieReviewSchemaFields>(
    "MovieReview",
    MovieReviewSchema,
);