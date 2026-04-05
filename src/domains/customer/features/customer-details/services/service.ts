/**
 * @file Service for aggregating customer identity and activity data for profile views.
 * @filename service.ts
 */

import type {
    CustomerProfileViewData,
    FetchCustomerProfileViewDataConfig
} from "@domains/customer/features/customer-details/services/service.types";
import User from "@models/User.model";
import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import {MovieReview} from "@domains/movieReview/model/MovieReview.model";
import {MoviePopulationPipelines} from "@domains/movie/queries/MoviePopulationPipelines";
import type {CustomerMovieReviewSummary} from "@domains/movieReview/model/MovieReview.types";

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
    const customer = await User.findOne({uniqueCode}).select("_id name email uniqueCode").orFail();

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