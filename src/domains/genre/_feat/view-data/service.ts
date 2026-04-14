/**
 * @fileoverview Service layer for fetching Genre-specific details and related movies.
 */

import type {FetchGenreDetailsViewConfig, FetchGenreDetailsViewReturns} from "./service.types";
import createHttpError from "http-errors";
import MovieModel from "@domains/movie/model/Movie.model";
import {Genre} from "@domains/genre/models/genre";

/**
 * Aggregates a genre's metadata with a paginated list of associated movies.
 * @throws {HttpError} 404 if the genre slug is invalid.
 */
export const fetchGenreDetails = async (
    {genreSlug, moviePagination: {page, perPage}}: FetchGenreDetailsViewConfig
): Promise<FetchGenreDetailsViewReturns> => {
    const genre = await Genre.findOne({slug: genreSlug}).lean();
    if (!genre) throw createHttpError(404, "Genre not found.");

    const [totalItems, items] = await Promise.all([
        MovieModel.countDocuments({genres: genre._id}),
        MovieModel.find({genres: genre._id})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate("genres")
            .lean()
    ]);

    return {
        genre,
        details: {
            movies: { items, totalItems }
        }
    };
};