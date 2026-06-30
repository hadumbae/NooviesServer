import {
    getFeaturedReviewsByMovie,
    getReviewDetailsByMovie,
    getReviewsByMovie
} from "@/domains/movie/_feat/fetch-reviews-by-movie/controller";
import {
    fetchFeaturedReviewsByMovie,
    fetchPaginatedReviewsByMovie,
    fetchReviewDetailsForMovie
} from "@/domains/movie/_feat/fetch-reviews-by-movie/service";
import type {
    BrowseReviewsByMovieConfig,
    FeaturedReviewsByMovieConfig,
    FeaturedReviewsByMovieReturns,
    ReviewDetailsByMovieConfig,
    ReviewDetailsByMovieReturns
} from "@/domains/movie/_feat/fetch-reviews-by-movie/service.types";
import {ReviewsByMovieRoutes} from "@/domains/movie/_feat/fetch-reviews-by-movie/routes";

export {
    ReviewsByMovieRoutes,
    getReviewsByMovie,
    getFeaturedReviewsByMovie,
    getReviewDetailsByMovie,
}

export {
    fetchPaginatedReviewsByMovie,
    fetchFeaturedReviewsByMovie,
    fetchReviewDetailsForMovie,
}

export type {
    BrowseReviewsByMovieConfig,
    FeaturedReviewsByMovieConfig,
    FeaturedReviewsByMovieReturns,
    ReviewDetailsByMovieConfig,
    ReviewDetailsByMovieReturns,
}