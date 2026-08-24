/**
 * @fileoverview Data access function for fetching featured movie reviews.
 */

import {Types} from "mongoose";
import type {RequestOptions} from "@/shared/_feat";
import {MovieReview, type MovieReviewSchemaFields} from "@/domains/movie-reviews/_models/review";
import {
    addMovieReviewDetailsPipelines,
    MovieReviewPopulationPipelines,
} from "@/domains/movie-reviews/_feat/query-population";

/** Parameters for retrieving featured reviews for a movie. */
export type FeaturedReviewsByMovieConfig = {
    movieID: Types.ObjectId;
    userID: Types.ObjectId;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
};

/** Featured review results for a movie. */
export type FeaturedReviewsByMovieReturns = {
    userReview: MovieReviewSchemaFields | null;
    reviews: MovieReviewSchemaFields[];
};

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
                    addMovieReviewDetailsPipelines({userID: userID}),
                    {$project: {helpfulLikes: 0}},
                    ...populationPipelines,
                ],
                reviews: [
                    {$match: {user: {$ne: userID}}},
                    addMovieReviewDetailsPipelines({userID: userID}),
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
};