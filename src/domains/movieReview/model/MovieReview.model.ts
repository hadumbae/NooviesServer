/**
 * @file MovieReview model registration.
 * MovieReview.model.ts
 */

import "./MovieReview.indexes.js";
import { model, Model } from "mongoose";
import type { MovieReviewSchemaFields } from "./MovieReview.types.js";
import { MovieReviewSchema } from "./MovieReview.schema.js";

/**
 * Mongoose model for MovieReview documents.
 */
export const MovieReviewModel: Model<MovieReviewSchemaFields> = model<MovieReviewSchemaFields>(
    "MovieReview",
    MovieReviewSchema,
);