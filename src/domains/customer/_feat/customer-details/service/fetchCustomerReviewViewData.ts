/**
 * @fileoverview Service for retrieving detailed movie review data for a specific customer.
 */

import createHttpError from "http-errors";
import {type LeanUserSchemaFields, User} from "@/domains/users";
import {MovieReview, type MovieReviewSchemaFields,} from "@/domains/movie-reviews/_models";
import {MovieWithRatingPipelines} from "@/domains/movie-reviews/_feat";
import {Types} from "mongoose";

/** Configuration for fetching a specific review context for a customer. */
export type FetchCustomerReviewViewDataConfig = {
    userId: Types.ObjectId;
    reviewId: Types.ObjectId;
}

/** Detailed view data for a single customer review including customer context. */
export type CustomerReviewViewData = {
    customer: LeanUserSchemaFields
    review: MovieReviewSchemaFields
}

/** Retrieves the full context for a specific customer review, including movie details and engagement metrics. */
export async function fetchCustomerReviewViewData(
    {userId, reviewId}: FetchCustomerReviewViewDataConfig
): Promise<CustomerReviewViewData> {
    const customer = await User.findById(userId).select("_id name email uniqueCode");
    if (!customer) throw createHttpError(404, "Customer Not Found.");

    const [review] = await MovieReview.aggregate<MovieReviewSchemaFields>([
        {$match: {_id: reviewId, user: customer._id}},
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