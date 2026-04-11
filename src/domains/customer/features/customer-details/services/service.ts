/**
 * @file Service for aggregating customer identity and activity data for profile views.
 * @filename service.ts
 */

import type {
    CustomerProfileViewData,
    CustomerReviewViewData,
    FetchCustomerProfileViewDataConfig,
    FetchCustomerReviewsViewData,
    FetchCustomerReviewsViewDataConfig,
    FetchCustomerReviewViewDataConfig
} from "@domains/customer/features/customer-details/services/service.types";
import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import {MovieReview} from "@domains/movieReview/model/MovieReview.model";
import type {CustomerMovieReviewSummary, MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types";
import createHttpError from "http-errors";
import {
    fetchRequiredCustomerByCode
} from "@domains/customer/features/customer-details/utils/fetchRequiredCustomerByCode";
import {MovieWithRatingPipelines} from "@domains/movieReview/queries/MovieWithRatingPipelines";
import {MoviePopulationPipelines} from "@domains/movie/queries/MoviePopulationPipelines";
import type {PaginationReturns} from "@shared/types/PaginationReturns";
import {buildPaginationPipelines} from "@shared/features/pagination-pipelines";
import type {PipelineStage} from "mongoose";

/**
 * Aggregates a customer's profile details, recent reservations, and movie reviews into a single payload.
 * ---
 * @param config - Configuration including the customer's unique code and display limits.
 * @returns A promise resolving to a composite {@link CustomerProfileViewData} object.
 * @throws DocumentNotFoundError via `orFail()` if the unique code does not match a user.
 */
export const fetchCustomerProfileViewData = async (
    {uniqueCode, reservationCounts = 5, reviewCounts = 5}: FetchCustomerProfileViewDataConfig
): Promise<CustomerProfileViewData> => {
    const customer = await fetchRequiredCustomerByCode(uniqueCode);

    const [resTotal, reservations] = await Promise.all([
        Reservation.countDocuments({user: customer._id}),
        Reservation
            .find({user: customer._id})
            .sort({createdAt: -1})
            .limit(reservationCounts),
    ]);

    const revTotal = await MovieReview.countDocuments({user: customer._id});
    const reviews = await MovieReview.aggregate<CustomerMovieReviewSummary>([
        {$match: {user: customer._id}},
        {$sort: {createdAt: -1}},
        {$limit: reviewCounts},
        {
            $lookup: {
                from: "movies",
                localField: "movie",
                foreignField: "_id",
                as: "movie",
                pipeline: MoviePopulationPipelines,
            },
        },
        {$unwind: "$movie"},
        {$addFields: {helpfulCount: {$size: "$helpfulLikes"}}},
        {$project: {helpfulLikes: 0}},
    ]);

    return {
        customer,
        reservation: {
            total: resTotal,
            items: reservations,
        },
        review: {
            total: revTotal,
            items: reviews,
        },
    };
}

/**
 * Retrieves the full context for a specific customer review, including moderation logs.
 * ---
 * @param config - Context identifiers for the customer and the specific review.
 * @returns {Promise<CustomerReviewViewData>} The hydrated review and author profile.
 */
export const fetchCustomerReviewViewData = async (
    {customerCode, reviewCode}: FetchCustomerReviewViewDataConfig
): Promise<CustomerReviewViewData> => {
    const customer = await fetchRequiredCustomerByCode(customerCode);

    const [review] = await MovieReview.aggregate<MovieReviewSchemaFields>([
        {$match: {user: customer._id, uniqueCode: reviewCode}},
        {
            $lookup: {
                from: "movies",
                localField: "movie",
                foreignField: "_id",
                as: "movie",
                pipeline: MovieWithRatingPipelines,
            },
        },
        {$unwind: "$movie"},
        {$addFields: {helpfulCount: {$size: "$helpfulLikes"}}},
        {$project: {helpfulLikes: 0}},
    ]);

    if (!review) {
        throw createHttpError(404, "Review Not Found.");
    }

    return {
        customer,
        review,
    };
}

/**
 * Fetches a paginated list of all reviews written by a specific customer.
 * ---
 */
export const fetchCustomerReviewsViewData = async (
    {customerCode, pagination: {page, perPage}}: FetchCustomerReviewsViewDataConfig
): Promise<FetchCustomerReviewsViewData> => {
    const customer = await fetchRequiredCustomerByCode(customerCode);

    const reviewInnerStages: PipelineStage.FacetPipelineStage[] = [
        {$sort: {createdAt: -1}},
        {$skip: (page - 1) * perPage},
        {$limit: perPage},
        {
            $lookup: {
                from: "movies",
                localField: "movie",
                foreignField: "_id",
                as: "movie",
                pipeline: MoviePopulationPipelines,
            },
        },
        {$set: {movie: {$first: "$movie"}}},
        {$addFields: {helpfulCount: {$size: "$helpfulLikes"}}},
        {$project: {helpfulLikes: 0}},
    ];

    const [reviews] = await MovieReview.aggregate<PaginationReturns<CustomerMovieReviewSummary>>([
        {$match: {user: customer._id}},
        ...buildPaginationPipelines({innerStages: reviewInnerStages}),
    ]);

    return {
        customer,
        reviews,
    }
}