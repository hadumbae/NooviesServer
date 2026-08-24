/**
 * @fileoverview Data access function for fetching paginated movie reviews for a specific movie.
 */

import type {PaginationReturns} from "@/shared/_types/pagination/PaginationReturns";
import type {MovieReviewSchemaFields} from "@/domains/movie-reviews/_models/review/MovieReview.types";
import {MovieReview} from "@/domains/movie-reviews/_models/review/MovieReview.model";
import populateQuery from "@/shared/utility/mongoose/populateQuery";
import {MovieReviewPopulatePaths} from "@/domains/movie-reviews/_feat/query-population/MovieReviewPopulatePaths";
import {Types} from "mongoose";
import type {RequestOptions} from "@/shared/_feat";

/** Parameters for paginated movie review retrieval. */
export type BrowseReviewsByMovieConfig = {
    movieID: Types.ObjectId;
    page: number;
    perPage: number;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
};

/**
 * Returns paginated reviews for a movie.
 */
export const fetchPaginatedReviewsByMovie = async (
    {movieID, page, perPage, options}: BrowseReviewsByMovieConfig
): Promise<PaginationReturns<MovieReviewSchemaFields>> => {
    const baseQuery = MovieReview
        .find({movie: movieID})
        .skip((page - 1) * perPage)
        .limit(perPage);

    const paginatedQuery = populateQuery({
        query: baseQuery,
        config: {...options, populatePaths: MovieReviewPopulatePaths},
    });

    const [totalItems, items] = await Promise.all([
        MovieReview.countDocuments({movie: movieID}),
        paginatedQuery,
    ]);

    return {
        totalItems,
        items,
    };
};