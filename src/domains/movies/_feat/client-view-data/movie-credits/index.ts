import {
    type CategoryGroupedCredits,
    fetchCreditsForMovie,
    type GroupedCreditsForMovieData
} from "@/domains/movies/_feat/client-view-data/movie-credits/fetchCreditsForMovie";
import {
    fetchMovieInfoCreditsViewData,
    type FetchMovieInfoCreditsViewDataConfig,
    type MovieInfoCreditsViewData
} from "@/domains/movies/_feat/client-view-data/movie-credits/fetchMovieInfoCreditsViewData";
import {
    type MovieInfoCreditsViewRouteConfig,
    MovieInfoCreditsViewRouteConfigSchema
} from "@/domains/movies/_feat/client-view-data/movie-credits/MovieInfoCreditsViewRouteConfigSchema";

export {
    fetchCreditsForMovie,
    fetchMovieInfoCreditsViewData,
    MovieInfoCreditsViewRouteConfigSchema,
}

export type {
    CategoryGroupedCredits,
    GroupedCreditsForMovieData,
    FetchMovieInfoCreditsViewDataConfig,
    MovieInfoCreditsViewData,
    MovieInfoCreditsViewRouteConfig,
}

