/**
 * @fileoverview Service for aggregating customer profile, reservation, and review data for the profile view.
 */

import type {LeanUserSchemaFields} from "@/domains/users/model/user/User.types";
import type {ReservationSchemaFields} from "@/domains/reservations/_model/reservation/Reservation.types";
import type {CustomerMovieReviewSummary} from "@/domains/movie-reviews/_models/review/MovieReview.types";
import {Reservation} from "@/domains/reservations/_model/reservation/Reservation.model";
import {MovieReview} from "@/domains/movie-reviews/_models/review/MovieReview.model";
import {MoviePopulationPipelines} from "@/domains/movies/_feat/query-population/MoviePopulationPipelines";
import {Types} from "mongoose";
import {User} from "@/domains/users";
import createHttpError from "http-errors";

/** Configuration parameters for fetching aggregated customer profile data. */
export type FetchCustomerProfileViewDataConfig = {
    userId: Types.ObjectId;
    reservationCounts?: number
    reviewCounts?: number
}

/** Aggregated data structure representing a comprehensive view of a customer's activity. */
export type CustomerProfileViewData = {
    customer: LeanUserSchemaFields
    reservation: {
        total: number
        items: ReservationSchemaFields[]
    }
    review: {
        total: number
        items: CustomerMovieReviewSummary[]
    }
}

/**
 * Aggregates a customer's profile details, recent reservations, and movie reviews into a single payload.
 */
export async function fetchCustomerProfileViewData(
    {userId, reservationCounts = 5, reviewCounts = 5}: FetchCustomerProfileViewDataConfig
): Promise<CustomerProfileViewData> {
    const customer = await User.findById(userId).select("-password -roles -favourites").lean();
    if (!customer) throw createHttpError(404, "Customer Not Found.");

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