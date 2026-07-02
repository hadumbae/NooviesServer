import {
    fetchMovieInfoReviewsViewData,
    type FetchMovieInfoReviewsViewDataConfig,
    type MovieInfoReviewsViewData
} from "@/domains/movies/_feat/client-view-data/movie-reviews/fetchMovieInfoReviewsViewData";
import {
    type MovieInfoReviewsViewRouteConfig,
    MovieInfoReviewsViewRouteConfigSchema
} from "@/domains/movies/_feat/client-view-data/movie-reviews/MovieInfoReviewsViewRouteConfigSchema";

export {
    MovieInfoReviewsViewRouteConfigSchema,
    fetchMovieInfoReviewsViewData,
}

export type {
    FetchMovieInfoReviewsViewDataConfig,
    MovieInfoReviewsViewRouteConfig,
    MovieInfoReviewsViewData,

}

