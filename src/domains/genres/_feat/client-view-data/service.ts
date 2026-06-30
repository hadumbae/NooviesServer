/**
 * @fileoverview Service layer for fetching public genre view data.
 * Orchestrates database queries to retrieve a single genre by its slug
 * and a paginated collection of its associated movies.
 */

import type {
    FetchGenreWithMoviesConfig,
    GenreWithMoviesReturns
} from "@/domains/genres/_feat/client-view-data/service.types";
import {Genre} from "@/domains/genres/_models/genre";
import {Movie} from "@/domains/movies/_models/movie/Movie.model";
import type {MovieWithGenres} from "@/domains/movies/_models/movie/Movie.types";

/**
 * Retrieves a genre and its associated movies for the public "Browse Genre" view.
 */
export async function fetchGenreWithMovies(
    {slug, moviePagination: {page, perPage}}: FetchGenreWithMoviesConfig
): Promise<GenreWithMoviesReturns> {
    const genre = await Genre.findOne({slug}).lean().orFail();

    const [totalItems, items] = await Promise.all([
        Movie.countDocuments({genres: genre._id}),
        Movie
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