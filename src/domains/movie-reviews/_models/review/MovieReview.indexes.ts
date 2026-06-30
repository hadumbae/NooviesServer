/**
 * @fileoverview Defines database indexes for the MovieReview schema to optimize queries and ensure data integrity.
 *
 */

import { MovieReviewSchema } from "@/domains/movie-reviews/_models/review/MovieReview.schema.js";

/**
 * Index to optimize queries by movie.
 */
MovieReviewSchema.index({ movie: 1 });

/**
 * Unique compound index to prevent duplicate reviews
 * for the same user and movie pair.
 */
MovieReviewSchema.index({ user: 1, movie: 1 }, { unique: true });