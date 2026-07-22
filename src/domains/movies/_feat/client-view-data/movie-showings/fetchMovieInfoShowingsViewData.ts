/**
 * @fileoverview Utility for fetching composite movie and showing data for the client-side movie info view.
 */

import createHttpError from "http-errors";
import {Movie, type MovieSchemaFields} from "@/domains/movies/_models/movie";
import {MoviePopulationPaths} from "@/domains/movies/_feat/query-population";
import {fetchShowingsForMovie} from "@/domains/movies/_feat/client-view-data/movie-showings/fetchShowingsForMovie";
import type {ShowingSchemaFields} from "@/domains/showing/_models/showing/Showing.types";
import type {
    MovieInfoShowingsViewRouteConfig
} from "@/domains/movies/_feat/client-view-data/movie-showings/MovieInfoShowingsViewRouteConfigSchema";

/** Configuration for fetching movie info and showings view data. */
export type FetchMovieInfoShowingsViewDataConfig = MovieInfoShowingsViewRouteConfig;

/** The composite data returned for the movie info showings view. */
export type MovieInfoShowingsViewData = {
    movie: MovieSchemaFields;
    totalShowings: number;
    showings: ShowingSchemaFields[];
}

/** Fetches a movie by slug and its associated paginated showings. */
export async function fetchMovieInfoShowingsViewData(
    {slug, ...queries}: MovieInfoShowingsViewRouteConfig
): Promise<MovieInfoShowingsViewData> {
    const movie = await Movie.findOne({slug}).populate(MoviePopulationPaths).lean({virtuals: true});
    if (!movie) throw createHttpError(404, "Movie not found.");

    const {items, totalItems} = await fetchShowingsForMovie({
        movieID: movie._id,
        queries,
    });

    return {
        movie,
        totalShowings: totalItems,
        showings: items,
    };
}