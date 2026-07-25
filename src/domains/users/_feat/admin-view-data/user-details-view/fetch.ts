/**
 * @fileoverview Data fetching logic for the user details administrative view.
 */

import {User, type UserSchemaFields} from "@/domains/users";
import type {UserDetailsViewRouteConfig} from "@/domains/users/_feat/admin-view-data";
import {Reservation, ReservationPopulatePaths, type ReservationSchemaFields} from "@/domains/reservations";
import createHttpError from "http-errors";
import {MovieReview, MovieReviewPopulatePaths, type MovieReviewSchemaFields} from "@/domains/movie-reviews";

/** Configuration for the user details fetch operation. */
type FetchConfig = UserDetailsViewRouteConfig;

/** Composite data structure for the user details view. */
type UserDetailsViewData = {
    user: UserSchemaFields;
    reviews: MovieReviewSchemaFields[];
    reservations: ReservationSchemaFields[];
}

/** Fetches a user document along with their recent reservations and movie reviews. */
export async function fetchUserDetailsViewData(
    {userID, reviewCount, reservationCount}: FetchConfig
): Promise<UserDetailsViewData> {
    const user = await User
        .findById(userID)
        .select("-password -favourites")
        .lean();

    if (!user) {
        throw createHttpError(404, "User not found.");
    }

    const reservationQuery = Reservation
        .find({user, status: {$in: ["PAID", "RESERVED"]}})
        .populate(ReservationPopulatePaths)
        .limit(reservationCount ?? 10)
        .lean();

    const reviewQuery = MovieReview
        .find({user})
        .populate(MovieReviewPopulatePaths)
        .limit(reviewCount ?? 10)
        .lean();

    const [reservations, reviews] = await Promise.all([reservationQuery, reviewQuery]);

    return {
        user,
        reviews,
        reservations,
    }
}