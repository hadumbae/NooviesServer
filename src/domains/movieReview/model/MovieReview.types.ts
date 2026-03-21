/**
 * @file Movie review document field types.
 * MovieReview.types.ts
 */

import {Types} from "mongoose";
import type {LeanUserSchemaFields} from "@models/User.types.js";
import type {MovieWithRating} from "../../movie/model/Movie.types.js";

/**
 * Movie review document fields.
 */
export interface MovieReviewSchemaFields {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    movie: Types.ObjectId;
    displayName: string;
    rating: number;
    summary: string;
    reviewText?: string;
    isRecommended?: boolean;
    helpfulLikes: Types.ObjectId[];
}

export type MyMovieReviewSchemaFields = Omit<
    MovieReviewSchemaFields,
    "user" | "movie" | "helpfulLikes"
> & {
    user: LeanUserSchemaFields;
    movie: MovieWithRating;
    helpfulCount: number;
};