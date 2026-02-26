/**
 * @file Browse movie details data-access operations.
 * BrowseMovieDetailsService.ts
 */

import type {BrowseReviewsByMovieParams} from "./BrowseMovieDetailsService.types.js";
import type {PaginationReturns} from "../../../../shared/types/PaginationReturns.js";
import type {MovieReviewSchemaFields} from "../../../movieReview/model/MovieReview.types.js";
import {MovieReview} from "../../../movieReview/model/MovieReview.model.js";
import populateQuery from "../../../../shared/utility/mongoose/populateQuery.js";
import {MovieReviewPopulatePaths} from "../../../movieReview/queries/MovieReviewPopulatePaths.js";

/**
 * Retrieves paginated reviews for a movie.
 *
 * Applies population based on provided request options.
 */
export const fetchReviewsByMovie = async (
    {movieID, page, perPage, options}: BrowseReviewsByMovieParams
): Promise<PaginationReturns<MovieReviewSchemaFields>> => {
    const baseQuery = MovieReview
        .find({movie: movieID})
        .skip((page - 1) * perPage);

    const paginatedQuery = populateQuery({
        query: baseQuery,
        options: {...options, populatePaths: MovieReviewPopulatePaths},
    });

    const [totalItems, items] = await Promise.all([
        MovieReview.countDocuments({movie: movieID}),
        paginatedQuery,
    ]);

    return {
        totalItems,
        items,
    };
}