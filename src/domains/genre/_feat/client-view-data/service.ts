/**
 * @fileoverview Service layer for fetching public genre view data.
 * Orchestrates database queries to retrieve a single genre by its slug
 * and a paginated collection of its associated movies.
 */

import type {
    FetchGenreWithMoviesConfig,
    GenreWithMoviesReturns
} from "@domains/genre/_feat/client-view-data/service.types";
import {Genre} from "@domains/genre/models/genre";
import MovieModel from "@domains/movie/model/Movie.model";
import type {MovieWithGenres} from "@domains/movie/model/Movie.types";

/**
 * Retrieves a genre and its associated movies for the public "Browse Genre" view.
 */
export async function fetchGenreWithMovies(
    {slug, moviePagination: {page, perPage}}: FetchGenreWithMoviesConfig
): Promise<GenreWithMoviesReturns> {
    const genre = await Genre.findOne({slug}).lean().orFail();

    const [totalItems, items] = await Promise.all([
        MovieModel.countDocuments({genres: genre._id}),
        MovieModel
            .find({genres: genre._id})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate("genres") // Hydrate genre IDs into full objects
            .lean<MovieWithGenres[]>(),
    ]);

    return {
        genre,
        movies: {totalItems, items}
    };
}