/**
 * @file Service layer for aggregating complex view-specific data for Genres.
 * @filename GenreViewDataService.ts
 */

import type {FetchGenreDetailsViewParams, FetchGenreDetailsViewReturns} from "./GenreViewDataService.types.js";
import Genre from "../../models/genre/Genre.model.js";
import createHttpError from "http-errors";
import MovieModel from "../../../movie/model/Movie.model.js";

/**
 * Retrieves a comprehensive dataset for a specific genre view, including related movies.
 * @param params - Configuration containing the target genre slug and pagination limits.
 * @returns A structured object containing genre metadata and a paginated list of movies.
 */
export const fetchGenreDetails = async (
    {genreSlug, moviePagination: {page, perPage}}: FetchGenreDetailsViewParams
): Promise<FetchGenreDetailsViewReturns> => {
    const genre = await Genre.findOne({slug: genreSlug}).lean();
    if (!genre) throw createHttpError(404, "Genre Is Not Found.");

    const totalItems = await MovieModel.countDocuments({genres: genre._id});

    const items = await MovieModel
        .find({genres: genre._id})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate("genres")
        .lean();

    return {
        genre,
        details: {
            movies: {items, totalItems},
        }
    };
};