import {MovieReviewSchema} from "@/domains/movie-reviews/_models/review/MovieReview.schema";
import {MovieReview} from "@/domains/movie-reviews/_models/review/MovieReview.model";
import type {
    CustomerMovieReviewSummary,
    MovieReviewSchemaFields,
    MyMovieReviewSchemaFields
} from "@/domains/movie-reviews/_models/review/MovieReview.types";

export {
    MovieReviewSchema,
    MovieReview,
}

export type {
    MovieReviewSchemaFields,
    MyMovieReviewSchemaFields,
    CustomerMovieReviewSummary,
}

