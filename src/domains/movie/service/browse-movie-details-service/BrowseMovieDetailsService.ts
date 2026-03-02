/**
 * @file Movie review browse data-access operations.
 * BrowseMovieDetailsService.ts
 */

import type {
    BrowseReviewsByMovieParams,
    ReviewDetailsByMovieParams,
    ReviewDetailsByMovieReturns
} from "./BrowseMovieDetailsService.types.js";
import type {PaginationReturns} from "../../../../shared/types/PaginationReturns.js";
import type {MovieReviewSchemaFields} from "../../../movieReview/model/MovieReview.types.js";
import {MovieReview} from "../../../movieReview/model/MovieReview.model.js";
import populateQuery from "../../../../shared/utility/mongoose/populateQuery.js";
import {MovieReviewPopulatePaths} from "../../../movieReview/queries/MovieReviewPopulatePaths.js";
import {MovieReviewPopulationPipelines} from "../../../movieReview/queries/MovieReviewPopulationPipelines.js";

/**
 * Returns paginated reviews for a movie.
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

/**
 * Returns paginated reviews with aggregate stats and the requesting user's review.
 */
export const fetchReviewDetailsByMovie = async (
    {userID, movieID, page, perPage, options}: ReviewDetailsByMovieParams
): Promise<ReviewDetailsByMovieReturns> => {
    const populationPipelines = options?.populate ? MovieReviewPopulationPipelines : [];

    const [result] = await MovieReview.aggregate<ReviewDetailsByMovieReturns>([
        {
            $match: {movie: movieID}
        },
        {
            $facet: {
                stats: [
                    {
                        $group: {
                            _id: null,
                            totalItems: {$sum: 1},
                            averageRating: {$avg: "$rating"},
                        }
                    }
                ],
                items: [
                    {$sort: {createdAt: -1}},
                    {$skip: perPage * (page - 1)},
                    {$limit: perPage},
                    ...populationPipelines,
                ],
                userReview: [
                    {$match: {user: userID}},
                    {$limit: 1},
                    ...populationPipelines,
                ],
            }
        },
        {
            $project: {
                items: "$items",
                userReview: {$ifNull: [{$arrayElemAt: ["$userReview", 0]}, null]},
                totalItems: {$arrayElemAt: ["$stats.totalItems", 0]},
                averageRating: {$arrayElemAt: ["$stats.averageRating", 0]},
            }
        },
    ]);

    return result;
}