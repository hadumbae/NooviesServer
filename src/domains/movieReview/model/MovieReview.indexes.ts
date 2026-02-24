/**
 * @file Defines indexes for the MovieReview schema.
 * MovieReview.indexes.ts
 */

import { MovieReviewSchema } from "./MovieReview.schema.js";

/**
 * Index to optimize queries by movie.
 */
MovieReviewSchema.index({ movie: 1 });

/**
 * Unique compound index to prevent duplicate reviews
 * for the same user and movie pair.
 */
MovieReviewSchema.index({ user: 1, movie: 1 }, { unique: true });