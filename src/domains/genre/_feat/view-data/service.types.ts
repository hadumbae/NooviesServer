/**
 * @fileoverview Type definitions for the Genre view-specific data service.
 */

import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import type {PaginationReturns} from "@shared/types/PaginationReturns";
import type {MovieSchemaFields} from "../../../movie/model/Movie.types";
import type {GenreSchemaFields} from "@domains/genre/models/genre";

/**
 * Configuration for fetching genre metadata and its associated movies.
 */
export type FetchGenreDetailsViewParams = {
    genreSlug: SlugString;
    moviePagination: {
        page: number;
        perPage: number;
    };
};

/**
 * Aggregated data structure for the Genre details administrative view.
 */
export type FetchGenreDetailsViewReturns = {
    genre: GenreSchemaFields;
    details: {
        movies: PaginationReturns<MovieSchemaFields>;
    };
};