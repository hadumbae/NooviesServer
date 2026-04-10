/**
 * @file Type definitions for the Customer Profile view aggregation service.
 * @filename service.types.ts
 */

import type {UserUniqueCode} from "@domains/users/validation";
import type {LeanUserSchemaFields} from "@models/User.types";
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation/Reservation.types";
import type {CustomerMovieReviewSummary, MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types";
import type {MovieReviewUniqueCode} from "@domains/movieReview/validation/MovieReviewUniqueCodeSchema";
import type {
    RequestPaginationOptions
} from "@shared/features/fetch-request-options/schemas/RequestPaginationOptionsSchema";
import type {PaginationReturns} from "@shared/types/PaginationReturns";
import type {
    MovieReviewModerationLogSchemaFields
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.types";

/**
 * Configuration parameters for fetching aggregated customer profile data.
 * ---
 * Used primarily by administrative dashboards to generate a high-level overview
 * of a specific user's system footprint.
 */
export type FetchCustomerProfileViewDataConfig = {
    /** The validated system code of the customer to retrieve. */
    uniqueCode: UserUniqueCode;

    /** Optional limit for the number of recent reservations to include (e.g., top 5). */
    reservationCounts?: number;

    /** Optional limit for the number of recent movie reviews to include. */
    reviewCounts?: number;
};

/**
 * Aggregated data structure representing a comprehensive view of a customer's activity.
 * ---
 * ### Mechanics
 * * **Data Consolidation:** Combines identity, commerce (reservations), and
 * social engagement (reviews) into a single payload to reduce round-trips
 * for profile landing pages.
 * * **Summarization:** Provides both total counts and sliced item arrays to
 * support "View All" links alongside recent activity lists.
 */
export type CustomerProfileViewData = {
    /** Core profile and identity information of the customer. */
    customer: LeanUserSchemaFields;

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
    customer: LeanUserSchemaFields;
    /** The full schema data for the specific movie review. */
    review: MovieReviewSchemaFields;
}

/**
 * Configuration for paginated retrieval of all reviews authored by a specific customer.
 */
export type FetchCustomerReviewsViewDataConfig = {
    /** The owner of the reviews. */
    customerCode: UserUniqueCode;
    /** Standard page and perPage parameters. */
    pagination: RequestPaginationOptions;
}

/**
 * Paginated response structure for a customer's review history.
 */
export type FetchCustomerReviewsViewData = {
    /** Identity of the review author. */
    customer: LeanUserSchemaFields;
    /** Paginated review records. */
    reviews: PaginationReturns<CustomerMovieReviewSummary>;
}

/**
 * Configuration for retrieving the audit trail of a specific review.
 */
export type FetchCustomerReviewLogsViewDataConfig = {
    /** The review whose moderation history is being audited. */
    reviewCode: MovieReviewUniqueCode;
    /** Standard pagination for log entries. */
    pagination: RequestPaginationOptions;
}

/**
 * Paginated moderation log entries for administrative oversight.
 */
export type FetchCustomerReviewLogsViewData = PaginationReturns<MovieReviewModerationLogSchemaFields>;