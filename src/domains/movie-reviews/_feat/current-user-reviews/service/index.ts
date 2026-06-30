import {
    createMovieReviewForCurrentUser,
    deleteMovieReviewForCurrentUser,
    fetchCurrentUserMovieReview,
    fetchCurrentUserMovieReviewList,
    updateMovieReviewForCurrentUser
} from "@/domains/movie-reviews/_feat/current-user-reviews/service/service";
import type {
    CreateUserMovieReviewConfig,
    DeleteUserMovieReviewConfig,
    FetchPaginatedUserReviewsConfig,
    UpdateUserMovieReviewConfig
} from "@/domains/movie-reviews/_feat/current-user-reviews/service/service.types";

export {
    fetchCurrentUserMovieReview,
    fetchCurrentUserMovieReviewList,
    createMovieReviewForCurrentUser,
    updateMovieReviewForCurrentUser,
    deleteMovieReviewForCurrentUser,
}

export type {
    FetchPaginatedUserReviewsConfig,
    CreateUserMovieReviewConfig,
    UpdateUserMovieReviewConfig,
    DeleteUserMovieReviewConfig,
}

