/**
 * @fileoverview Defines the type configurations and response structures for
 * customer profile aggregation services.
 */

import type {UserUniqueCode} from "@domains/users/validation"
import type {LeanUserSchemaFields} from "@models/User.types"
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation/Reservation.types"
import type {CustomerMovieReviewSummary, MovieReviewSchemaFields} from "@domains/movieReview/model/MovieReview.types"
import type {MovieReviewUniqueCode} from "@domains/movieReview/validation/MovieReviewUniqueCodeSchema"
import type {
    RequestPaginationOptions
} from "@shared/features/fetch-request-options/schemas/RequestPaginationOptionsSchema"
import type {PaginationReturns} from "@shared/types/PaginationReturns"
import type {
    MovieReviewModerationLogSchemaFields
} from "@domains/movieReview/model/moderationLogs/MovieReviewModerationLog.types"

/**
 * Configuration parameters for fetching aggregated customer profile data.
 */
export type FetchCustomerProfileViewDataConfig = {
    /** The validated system code of the customer to retrieve. */
    uniqueCode: UserUniqueCode
    /** Optional limit for the number of recent reservations to include. */
    reservationCounts?: number
    /** Optional limit for the number of recent movie reviews to include. */
    reviewCounts?: number
}

/**
 * Aggregated data structure representing a comprehensive view of a customer's
 * activity, including identity, commerce, and social engagement.
 */
export type CustomerProfileViewData = {
    /** Core profile and identity information of the customer. */
    customer: LeanUserSchemaFields
    reservation: {
        /** Total count of reservations found in the database. */
        total: number
        /** Subset of reservation records based on requested count. */
        items: ReservationSchemaFields[]
    }
    review: {
        total: number
        items: CustomerMovieReviewSummary[]
    }
}

/**
 * Configuration for fetching a specific review context for a customer.
 */
export type FetchCustomerReviewViewDataConfig = {
    customerCode: UserUniqueCode
    reviewCode: MovieReviewUniqueCode
}

/**
 * Detailed view data for a single customer review, including customer context.
 */
export type CustomerReviewViewData = {
    customer: LeanUserSchemaFields
    review: MovieReviewSchemaFields
}

/**
 * Configuration for paginated retrieval of all reviews authored by a
 * specific customer.
 */
export type FetchCustomerReviewsViewDataConfig = {
    customerCode: UserUniqueCode
    pagination: RequestPaginationOptions
}

/**
 * Paginated response structure for a customer's review history.
 */
export type FetchCustomerReviewsViewData = {
    customer: LeanUserSchemaFields
    reviews: PaginationReturns<CustomerMovieReviewSummary>
}

/**
 * Configuration for retrieving the audit trail of a specific review.
 */
export type FetchCustomerReviewLogsViewDataConfig = {
    reviewCode: MovieReviewUniqueCode
    pagination: RequestPaginationOptions
}

/**
 * Paginated moderation log entries for administrative oversight.
 */
export type FetchCustomerReviewLogsViewData = PaginationReturns<MovieReviewModerationLogSchemaFields>