import {
    type MovieReviewCreateInputData,
    MovieReviewCreateInputSchema
} from "@/domains/movie-reviews/_feat/validate-submit/schemas/MovieReviewCreateInputSchema";
import {
    type MovieReviewUpdateInputData,
    MovieReviewUpdateInputSchema
} from "@/domains/movie-reviews/_feat/validate-submit/schemas/MovieReviewUpdateInputSchema";

export {
    MovieReviewCreateInputSchema,
    MovieReviewUpdateInputSchema,
}

export type {
    MovieReviewCreateInputData,
    MovieReviewUpdateInputData,
}