/**
 * @file Type definitions for the GenreViewDataService.
 * @filename GenreViewDataService.types.ts
 */

import type {SlugString} from "../../../../shared/schema/strings/SlugStringSchema.js";
import type {GenreSchemaFields} from "../../models/genre/Genre.types.js";
import type {PaginationReturns} from "../../../../shared/types/PaginationReturns.js";
import type {MovieSchemaFields} from "../../../movie/model/Movie.types.js";

/**
 * Input parameters for fetching genre-specific view data.
 */
export type FetchGenreDetailsViewParams = {
    /** The SEO-friendly unique identifier for the genre. */
    genreSlug: SlugString;
    /** Pagination configuration for the associated movies list. */
    moviePagination: {
        /** The current page index (1-based). */
        page: number;
        /** The maximum number of movies to return in the current slice. */
        perPage: number;
    }
}

/**
 * Standardized return structure for the genre details view.
 */
export type FetchGenreDetailsViewReturns = {
    /** The core genre document fields. */
    genre: GenreSchemaFields;
    /** Aggregated details specific to the genre view. */
    details: {
        /** A paginated collection of movie documents belonging to the genre. */
        movies: PaginationReturns<MovieSchemaFields>;
    }
}