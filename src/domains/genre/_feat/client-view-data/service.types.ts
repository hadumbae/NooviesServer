/**
 * @fileoverview Type definitions for the Genre Client View Data service.
 * Defines the input configurations and structured return types for public genre views.
 */

import type {
    RequestPaginationOptions
} from "@shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema";
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import type {GenreSchemaFields} from "@domains/genre/models/genre";
import type {PaginationReturns} from "@shared/types/PaginationReturns";
import type {MovieWithGenres} from "@domains/movie/model/Movie.types";

/**
 * Configuration object for the `fetchGenreWithMovies` service function.
 */
export type FetchGenreWithMoviesConfig = {
    slug: SlugString;
    moviePagination: RequestPaginationOptions;
}

/**
 * The consolidated response structure for the Genre browsing view.
 */
export type GenreWithMoviesReturns = {
    genre: GenreSchemaFields;
    movie: PaginationReturns<MovieWithGenres>;
}