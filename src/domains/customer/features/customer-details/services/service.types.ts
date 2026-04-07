/**
 * @file Type definitions for the Customer Profile view aggregation service.
 * @filename service.types.ts
 */

import type {UserUniqueCode} from "@domains/users/validation";
import type {UserSchemaFields} from "@models/User.types";
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation/Reservation.types";
import type {CustomerMovieReviewSummary, MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types";
import type {MovieReviewUniqueCode} from "@domains/movieReview/validation/MovieReviewUniqueCodeSchema";

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
        /** Subset of {@link CustomerMovieReviewSummary} including hydrated movie and like counts. */
        items: CustomerMovieReviewSummary[];
    },
};

/**
 * Configuration for fetching a specific review context for a customer.
 */
export type FetchCustomerReviewViewDataConfig = {
    /** The unique identifier of the customer who wrote the review. */
    customerCode: UserUniqueCode;
    /** The unique identifier of the specific movie review. */
    reviewCode: MovieReviewUniqueCode;
}

/**
 * Detailed view data for a single customer review, including customer context.
 */
export type CustomerReviewViewData = {
    /** The profile data of the review author. */
    customer: UserSchemaFields;
    /** The full schema data for the specific movie review. */
    review: MovieReviewSchemaFields;
}