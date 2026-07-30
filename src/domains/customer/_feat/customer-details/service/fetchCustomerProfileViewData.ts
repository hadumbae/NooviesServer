/**
 * @fileoverview Service to fetch and aggregate data for the customer profile view.
 */

import type {LeanUserSchemaFields} from "@/domains/users/model/user/User.types";
import type {ReservationSchemaFields} from "@/domains/reservations/_model/reservation/Reservation.types";
import type {MovieReviewSchemaFields} from "@/domains/movie-reviews/_models/review/MovieReview.types";
import {Reservation} from "@/domains/reservations/_model/reservation/Reservation.model";
import {MovieReview} from "@/domains/movie-reviews/_models/review/MovieReview.model";
import {Types} from "mongoose";
import {User} from "@/domains/users";
import createHttpError from "http-errors";
import {MovieReviewPopulatePaths} from "@/domains/movie-reviews";

/** Configuration options for fetching customer profile data. */
export type FetchCustomerProfileViewDataConfig = {
    userId: Types.ObjectId;
    reservationCounts?: number
    reviewCounts?: number
}

/** The aggregated data structure for the customer profile view. */
export type CustomerProfileViewData = {
    customer: LeanUserSchemaFields
    reservation: {
        total: number
        items: ReservationSchemaFields[]
    }
    review: {
        total: number
        items: MovieReviewSchemaFields[]
    }
}

/** Fetches a customer's profile, recent reservations, and recent reviews. */
export async function fetchCustomerProfileViewData(
    {userId, reservationCounts = 5, reviewCounts = 5}: FetchCustomerProfileViewDataConfig
): Promise<CustomerProfileViewData> {
    const customer = await User
        .findById(userId)
        .select("-password -roles -favourites")
        .lean();

    if (!customer) {
        throw createHttpError(404, "Customer Not Found.");
    }

    const reservationCountQuery = Reservation.countDocuments({user: customer._id});
    const reviewCountQuery = MovieReview.countDocuments({user: customer._id})

    const reservationQuery = Reservation
        .find({user: customer._id})
        .sort({createdAt: -1})
        .limit(reservationCounts);

    const reviewQuery = MovieReview
        .find({user: customer._id})
        .sort({createdAt: -1})
        .limit(reviewCounts)
        .populate(MovieReviewPopulatePaths);

    const [resTotal, revTotal, reservations, reviews] = await Promise.all([
        reservationCountQuery,
        reviewCountQuery,
        reservationQuery,
        reviewQuery,
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
    }
}