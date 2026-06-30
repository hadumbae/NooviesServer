import type {
    FetchGenreWithMoviesConfig,
    GenreWithMoviesReturns
} from "@/domains/genres/_feat/client-view-data/service.types";
import {fetchGenreWithMovies} from "@/domains/genres/_feat/client-view-data/service";
import {getFetchGenreWithMovies} from "@/domains/genres/_feat/client-view-data/controller";
import {GenreClientViewDataRoutes} from "@/domains/genres/_feat/client-view-data/routes";


export {
    fetchGenreWithMovies,
    getFetchGenreWithMovies,
    GenreClientViewDataRoutes,
}
export type {
    FetchGenreWithMoviesConfig,
    GenreWithMoviesReturns,
}