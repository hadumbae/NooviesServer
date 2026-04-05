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
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import type {MovieReviewUniqueCode} from "@domains/movieReview/validation/MovieReviewUniqueCodeSchema";

/**
 * Core fields for the Movie Review database document.
 * ---
 */
export interface MovieReviewSchemaFields {
    /** Unique database identifier for the review document. */
    _id: Types.ObjectId;
    /** Reference to the User who authored the review. */
    user: Types.ObjectId;
    /** Reference to the Movie being reviewed. */
    movie: Types.ObjectId;
    /** Publicly visible name of the reviewer. */
    displayName: string;
    /** Numeric score assigned to the movie (1-5 scale). */
    rating: number;
    /** Brief headline summarizing the user's opinion. */
    summary: string;
    /** Detailed body text of the review. */
    reviewText?: string;
    /** Flag indicating whether the reviewer suggests this movie. */
    isRecommended?: boolean;
    /** List of User IDs who marked the review as helpful. */
    helpfulLikes: Types.ObjectId[];
    /** Toggle for public visibility or moderation status. */
    isPublic: boolean;
    /** Chronological history of administrative actions taken on this review. */
    moderationLogs: MovieReviewModerationLogSchemaFields[];
    /** SEO-friendly URL identifier. */
    slug: SlugString;
    /** Standardized tracking code (e.g., REV-XXXXX-XXXXX). */
    uniqueCode: MovieReviewUniqueCode;
}

/**
 * Representation of a review from the perspective of the author.
 * ---
 */
export type MyMovieReviewSchemaFields = Omit<
    MovieReviewSchemaFields,
    "user" | "movie" | "helpfulLikes"
> & {
    /** Hydrated author profile information. */
    user: LeanUserSchemaFields;
    /** Hydrated movie data including aggregate ratings. */
    movie: MovieWithRating;
    /** The total count of "helpful" marks received. */
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
    /** The total count of "helpful" marks received. */
    helpfulCount: number;
};