/**
 * @fileoverview Provides services for aggregating customer identity and activity data.
 */

import type {
    CustomerProfileViewData,
    CustomerReviewViewData,
    FetchCustomerProfileViewDataConfig,
    FetchCustomerReviewLogsViewDataConfig,
    FetchCustomerReviewsViewData,
    FetchCustomerReviewsViewDataConfig,
    FetchCustomerReviewViewDataConfig
} from "@domains/customer/features/customer-details/services/service.types"
import Reservation from "@domains/reservation/model/reservation/Reservation.model"
import {MovieReview} from "@domains/movieReview/model/MovieReview.model"
import type {CustomerMovieReviewSummary, MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types"
import createHttpError from "http-errors"
import {
    fetchRequiredCustomerByCode
} from "@domains/customer/features/customer-details/utils/fetchRequiredCustomerByCode"
import {MovieWithRatingPipelines} from "@domains/movieReview/queries/MovieWithRatingPipelines"
import {MoviePopulationPipelines} from "@domains/movie/queries/MoviePopulationPipelines"
import type {PaginationReturns} from "@shared/types/PaginationReturns"
import {buildPaginationPipelines} from "@shared/features/pagination-pipelines"
import type {PipelineStage} from "mongoose"
import type {
    MovieReviewModerationLogSchemaFields
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.types"
import {MovieReviewModerationLog} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.model"

/**
 * Aggregates a customer's profile details, recent reservations, and movie
 * reviews into a single payload for the profile view.
 */
export async function fetchCustomerProfileViewData(
    {uniqueCode, reservationCounts = 5, reviewCounts = 5}: FetchCustomerProfileViewDataConfig
): Promise<CustomerProfileViewData> {
    const customer = await fetchRequiredCustomerByCode(uniqueCode)

    const [resTotal, reservations] = await Promise.all([
        Reservation.countDocuments({user: customer._id}),
        Reservation
            .find({user: customer._id})
            .sort({createdAt: -1})
            .limit(reservationCounts),
    ])

    const revTotal = await MovieReview.countDocuments({user: customer._id})
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
    ])

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
    }
}

/**
 * Retrieves the full context for a specific customer review, including
 * movie details and engagement metrics.
 */
export async function fetchCustomerReviewViewData(
    {customerCode, reviewCode}: FetchCustomerReviewViewDataConfig
): Promise<CustomerReviewViewData> {
    const customer = await fetchRequiredCustomerByCode(customerCode)

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
    ])

    if (!review) {
        throw createHttpError(404, "Review Not Found.")
    }

    return {
        customer,
        review,
    }
}

/**
 * Fetches a paginated list of all reviews authored by a specific customer,
 * including populated movie information.
 */
export async function fetchCustomerReviewsViewData(
    {customerCode, pagination: {page, perPage}}: FetchCustomerReviewsViewDataConfig
): Promise<FetchCustomerReviewsViewData> {
    const customer = await fetchRequiredCustomerByCode(customerCode)

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
    ]

    const [reviews] = await MovieReview.aggregate<PaginationReturns<CustomerMovieReviewSummary>>([
        {$match: {user: customer._id}},
        ...buildPaginationPipelines({innerStages: reviewInnerStages}),
    ])

    return {
        customer,
        reviews,
    }
}

/**
 * Retrieves a paginated list of moderation audit logs for a specific review,
 * populating the details of the performing administrator.
 */
export async function fetchCustomerReviewLogsViewData(
    {reviewCode, pagination: {page, perPage}}: FetchCustomerReviewLogsViewDataConfig
): Promise<PaginationReturns<MovieReviewModerationLogSchemaFields>> {
    const review = await MovieReview.findOne({uniqueCode: reviewCode}).orFail()

    const [totalItems, items] = await Promise.all([
        MovieReviewModerationLog.countDocuments({review: review._id}),
        MovieReviewModerationLog
            .find({review: review._id})
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate({path: "admin", select: "_id name email uniqueCode"})
    ])

    return {
        totalItems,
        items,
    }
}