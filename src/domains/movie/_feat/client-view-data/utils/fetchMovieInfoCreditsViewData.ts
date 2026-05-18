/**
 * @fileoverview Utility for fetching and aggregating movie details with grouped credit information.
 */

import createHttpError from "http-errors";
import {Movie, type MovieSchemaFields} from "@domains/movie/model/movie";
import {MoviePopulationPaths} from "@domains/movie/_feat/query-population";
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import {fetchCreditsForMovie, type GroupedCreditsForMovieData} from "@domains/movie/_feat/client-view-data";

/** Configuration for fetching movie credits along with movie details. */
export type FetchMovieInfoCreditsViewDataConfig = {
    slug: SlugString;
};
/** The result containing movie details and grouped credit information. */
export type MovieInfoCreditsViewData = {
    movie: MovieSchemaFields;
    creditDetails: GroupedCreditsForMovieData;
};

/** Retrieves a movie by slug and its associated grouped credits. */
export async function fetchMovieInfoCreditsViewData(
    {slug}: FetchMovieInfoCreditsViewDataConfig
): Promise<MovieInfoCreditsViewData> {
    const movie = await Movie
        .findOne({slug})
        .populate(MoviePopulationPaths)
        .lean({virtuals: true});

    if (!movie) throw createHttpError(404, "Movie not found.");
    const creditDetails = await fetchCreditsForMovie(movie._id);

    return {
        movie,
        creditDetails,
    };
}