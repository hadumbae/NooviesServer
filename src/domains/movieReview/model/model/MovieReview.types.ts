/**
 * @fileoverview Defines TypeScript types and interfaces for movie review database schemas and data transfer objects.
 */

import {Types} from "mongoose";
import type {LeanUserSchemaFields} from "@domains/users/model/User.types.js";
import type {MovieWithGenres, MovieWithRating} from "@domains/movie/model/movie/Movie.types";
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import type {MovieReviewUniqueCode} from "@domains/movieReview/validation/review-code/MovieReviewUniqueCodeSchema";

/** Core fields for the MovieReview database schema. */
export type MovieReviewSchemaFields = {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    movie: Types.ObjectId;
    displayName: string;
    rating: number;
    summary: string;
    reviewText?: string;
    isRecommended?: boolean;
    helpfulLikes: Types.ObjectId[];
    isPublic: boolean;
    slug: SlugString;
    uniqueCode: MovieReviewUniqueCode;
}

/** Represents a movie review with populated user and movie details for the author's view. */
export type MyMovieReviewSchemaFields = Omit<MovieReviewSchemaFields, "user" | "movie" | "helpfulLikes"> & {
    user: LeanUserSchemaFields;
    movie: MovieWithRating;
    helpfulCount: number;
};

/** Summary of a movie review including genre information and helpfulness metrics for public display. */
export type CustomerMovieReviewSummary = Omit<MovieReviewSchemaFields, "movie" | "helpfulLikes"> & {
    movie: MovieWithGenres;
    helpfulCount: number;
};