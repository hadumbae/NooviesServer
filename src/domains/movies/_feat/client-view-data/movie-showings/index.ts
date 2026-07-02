import {
    fetchMovieInfoShowingsViewData,
    type FetchMovieInfoShowingsViewDataConfig,
    type MovieInfoShowingsViewData
} from "@/domains/movies/_feat/client-view-data/movie-showings/fetchMovieInfoShowingsViewData";
import {
    fetchShowingsForMovie,
    type FetchShowingsForMovieConfig,
    type PaginatedShowingsForMovie
} from "@/domains/movies/_feat/client-view-data/movie-showings/fetchShowingsForMovie";
import {
    type MovieInfoShowingsViewRouteConfig,
    MovieInfoShowingsViewRouteConfigSchema
} from "@/domains/movies/_feat/client-view-data/movie-showings/MovieInfoShowingsViewRouteConfigSchema";

export {
    fetchMovieInfoShowingsViewData,
    MovieInfoShowingsViewRouteConfigSchema,
    fetchShowingsForMovie,
}

export type {
    FetchMovieInfoShowingsViewDataConfig,
    FetchShowingsForMovieConfig,
    MovieInfoShowingsViewRouteConfig,
    MovieInfoShowingsViewData,
    PaginatedShowingsForMovie,
}