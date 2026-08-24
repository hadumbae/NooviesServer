/**
 * @fileoverview Data access function for fetching paginated movie reviews along with aggregate statistics and user-specific review data.
 */

import {Types} from "mongoose";
import type {PaginationReturns} from "@/shared/_types";
import {MovieReview, type MovieReviewSchemaFields} from "@/domains/movie-reviews/_models/review";
import type {
    BrowseReviewsByMovieConfig
} from "@/domains/movies/_feat/fetch-reviews-by-movie/service/fetchPaginatedReviewsByMovie";
import {
    addMovieReviewDetailsPipelines,
    MovieReviewPopulationPipelines,
} from "@/domains/movie-reviews/_feat/query-population";

/** Parameters for review retrieval including user context. */
export type ReviewDetailsByMovieConfig = BrowseReviewsByMovieConfig & {
    userID: Types.ObjectId;
};

/** Paginated reviews with aggregate rating and user-specific review. */
export type ReviewDetailsByMovieReturns = PaginationReturns<MovieReviewSchemaFields> & {
    averageRating: number | null;
    userReview: MovieReviewSchemaFields | null;
};

/**
 * Returns paginated reviews with aggregate stats and the requesting user's review.
 */
export const fetchReviewDetailsForMovie = async (
    {userID, movieID, page, perPage, options}: ReviewDetailsByMovieConfig
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
                        },
                    },
                ],
                items: [
                    addMovieReviewDetailsPipelines({userID}),
                    {$project: {helpfulLikes: 0}},
                    {$sort: {createdAt: -1}},
                    {$skip: perPage * (page - 1)},
                    {$limit: perPage},
                    ...populationPipelines,
                ],
                userReview: [
                    {$match: {user: userID}},
                    {$limit: 1},
                    addMovieReviewDetailsPipelines({userID}),
                    {$project: {helpfulLikes: 0}},
                    ...populationPipelines,
                ],
            }
        },
        {
            $project: {
                items: "$items",
                userReview: {$ifNull: [{$arrayElemAt: ["$userReview", 0]}, null]},
                totalItems: {$ifNull: [{$arrayElemAt: ["$stats.totalItems", 0]}, 0]},
                averageRating: {$ifNull: [{$arrayElemAt: ["$stats.averageRating", 0]}, null]},
            }
        },
    ]);

    return result;
};