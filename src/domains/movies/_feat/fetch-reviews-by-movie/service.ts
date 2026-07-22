/**
 * @file Movie review browse data-access operations.
 * BrowseMovieDetailsService.ts
 */


import type {
    BrowseReviewsByMovieConfig,
    FeaturedReviewsByMovieConfig,
    FeaturedReviewsByMovieReturns,
    ReviewDetailsByMovieConfig,
    ReviewDetailsByMovieReturns
} from "./service.types";
import type {MovieReviewSchemaFields} from "@/domains/movie-reviews/_models/review/MovieReview.types";
import type {PaginationReturns} from "@/shared/_types/pagination/PaginationReturns";
import {MovieReview} from "@/domains/movie-reviews/_models/review/MovieReview.model";
import populateQuery from "@/shared/utility/mongoose/populateQuery";
import {MovieReviewPopulatePaths} from "@/domains/movie-reviews/_feat/query-population/MovieReviewPopulatePaths";
import {MovieReviewPopulationPipelines} from "@/domains/movie-reviews/_feat/query-population/MovieReviewPopulationPipelines";
import {addMovieReviewDetailsPipelines} from "@/domains/movie-reviews/_feat/query-population/addMovieReviewDetailsPipelines";

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
}

/**
 * Fetches featured reviews for a movie.
 */
export const fetchFeaturedReviewsByMovie = async (
    {movieID, userID, options}: FeaturedReviewsByMovieConfig
): Promise<FeaturedReviewsByMovieReturns> => {
    const populationPipelines = options?.populate ? MovieReviewPopulationPipelines : [];

    const [result] = await MovieReview.aggregate<FeaturedReviewsByMovieReturns>([
        {$match: {movie: movieID}},
        {
            $facet: {
                userReviews: [
                    {$match: {user: userID}},
                    {$limit: 1},
                    addMovieReviewDetailsPipelines({userID}),
                    {$project: {helpfulLikes: 0}},
                    ...populationPipelines,
                ],
                reviews: [
                    {$match: {user: {$ne: userID}}},
                    addMovieReviewDetailsPipelines({userID}),
                    {$project: {helpfulLikes: 0}},
                    {$sort: {helpfulCount: -1}},
                    {$limit: 3},
                    ...populationPipelines,
                ],
            },
        },
        {
            $project: {
                userReview: {$ifNull: [{$arrayElemAt: ["$userReviews", 0]}, null]},
                reviews: "$reviews",
            }
        }
    ]);

    return result;
}

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
}