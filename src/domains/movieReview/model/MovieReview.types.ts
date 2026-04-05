/**
 * @file TypeScript interfaces and types for Movie Review database documents.
 * @filename MovieReview.types.ts
 */

import {Types} from "mongoose";
import type {LeanUserSchemaFields} from "@models/User.types.js";
import type {MovieWithGenres, MovieWithRating} from "../../movie/model/Movie.types.js";
import type {
    MovieReviewModerationLogSchemaFields
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.types";

/**
 * Core fields for the Movie Review database document.
 * ---
 */
export interface MovieReviewSchemaFields {
    /** Unique database identifier for the review. */
    _id: Types.ObjectId;
    /** Reference to the User who authored the review. */
    user: Types.ObjectId;
    /** Reference to the Movie being reviewed. */
    movie: Types.ObjectId;
    /** Publicly visible name of the reviewer. */
    displayName: string;
    /** Numeric score (1-5). */
    rating: number;
    /** Brief headline of the user's opinion. */
    summary: string;
    /** Detailed body text of the review. */
    reviewText?: string;
    /** Flag indicating user recommendation status. */
    isRecommended?: boolean;
    /** List of User IDs who marked the review as helpful. */
    helpfulLikes: Types.ObjectId[];
    /** Visibility status for public-facing queries. */
    isPublic: boolean;
    /** Chronological history of administrative actions taken on this review. */
    moderationLogs: MovieReviewModerationLogSchemaFields[];
}

/**
 * Representation of a review from the perspective of the author.
 * ---
 */
export type MyMovieReviewSchemaFields = Omit<
    MovieReviewSchemaFields,
    "user" | "movie" | "helpfulLikes"
> & {
    /** Hydrated author profile. */
    user: LeanUserSchemaFields;
    /** Hydrated movie data including ratings. */
    movie: MovieWithRating;
    /** Numeric tally of helpful votes. */
    helpfulCount: number;
};

/**
 * Summary representation used in admin-facing overview lists or customer profiles.
 * ---
 */
export type CustomerMovieReviewSummary =
    Omit<MovieReviewSchemaFields, "movie" | "helpfulLikes"> & {
    /** Hydrated movie data including genre details. */
    movie: MovieWithGenres;
    /** Numeric tally of helpful votes. */
    helpfulCount: number;
};