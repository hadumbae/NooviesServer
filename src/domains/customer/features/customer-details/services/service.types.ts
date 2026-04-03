/**
 * @file Type definitions for the Customer Profile view aggregation service.
 * @filename service.types.ts
 */

import type {UserUniqueCode} from "@domains/users/validation";
import type {UserSchemaFields} from "@models/User.types";
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation/Reservation.types";
import type {MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types";

/**
 * Configuration parameters for fetching aggregated customer profile data.
 * ---
 */
export type FetchCustomerProfileViewDataConfig = {
    /** The validated system code of the customer to retrieve. */
    uniqueCode: UserUniqueCode;

    /** Optional limit for the number of recent reservations to include. */
    reservationCounts?: number;

    /** Optional limit for the number of recent movie reviews to include. */
    reviewCounts?: number;
};

/**
 * Aggregated data structure representing a comprehensive view of a customer's activity.
 * ---
 */
export type CustomerProfileViewData = {
    /** Core profile and identity information of the customer. */
    customer: UserSchemaFields;

    /** Transactional history summary. */
    reservation: {
        /** Total count of reservations found in the database. */
        total: number;
        /** Subset of {@link ReservationSchemaFields} based on the requested count. */
        items: ReservationSchemaFields[];
    };

    /** Engagement history summary. */
    review: {
        /** Total count of reviews submitted by the customer. */
        total: number;
        /** Subset of {@link MovieReviewSchemaFields} based on the requested count. */
        items: MovieReviewSchemaFields[];
    },
};