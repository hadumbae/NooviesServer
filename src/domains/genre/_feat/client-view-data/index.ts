import type {
    FetchGenreWithMoviesConfig,
    GenreWithMoviesReturns
} from "@domains/genre/_feat/client-view-data/service.types";
import {fetchGenreWithMovies} from "@domains/genre/_feat/client-view-data/service";
import {getFetchGenreWithMovies} from "@domains/genre/_feat/client-view-data/controller";

export {
    fetchGenreWithMovies,
    getFetchGenreWithMovies,
}
export type {
    FetchGenreWithMoviesConfig,
    GenreWithMoviesReturns,
}