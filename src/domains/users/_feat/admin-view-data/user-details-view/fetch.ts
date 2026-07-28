/**
 * @fileoverview Data fetching logic for the user details administrative view.
 */

import {User, type UserSchemaFields} from "@/domains/users";
import type {UserDetailsViewRouteConfig} from "@/domains/users/_feat/admin-view-data";
import {Reservation} from "@/domains/reservations";
import createHttpError from "http-errors";
import {MovieReview} from "@/domains/movie-reviews";

/** Configuration for the user details fetch operation. */
type FetchConfig = UserDetailsViewRouteConfig;

/** Composite data structure for the user details view. */
type UserDetailsViewData = {
    user: UserSchemaFields;
    totalReviews: number;
    totalReservations: number;
}

/** Fetches a user document along with their recent reservations and movie reviews. */
export async function fetchUserDetailsViewData(
    {userID}: FetchConfig
): Promise<UserDetailsViewData> {
    const user = await User
        .findById(userID)
        .select("-password -favourites")
        .lean();

    if (!user) {
        throw createHttpError(404, "User not found.");
    }

    const reviewCountQuery = MovieReview.countDocuments({user})
    const reservationCountQuery = Reservation.countDocuments({user})

    const [totalReviews, totalReservations] = await Promise.all([
        reviewCountQuery,
        reservationCountQuery,
    ]);

    return {
        user,
        totalReviews,
        totalReservations,
    }
}