/**
 * @fileoverview Defines type configurations and response structures for customer profile aggregation services.
 *
 */

import type {UserUniqueCode} from "@/domains/users/_feat/manage-user-unique-code/schemas"
import type {LeanUserSchemaFields} from "@/domains/users/model/user/User.types"
import type {CustomerMovieReviewSummary, MovieReviewSchemaFields} from "@/domains/movie-reviews/_models/review/MovieReview.types"
import type {MovieReviewUniqueCode} from "@/domains/movie-reviews/_validation/review-code/MovieReviewUniqueCodeSchema"
import type {RequestPaginationOptions} from "@/shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema"
import type {PaginationReturns} from "@/shared/_types/pagination/PaginationReturns"
import type {ReservationSchemaFields} from "@/domains/reservations/_model/reservation";
import type {MovieReviewModerationLogSchemaFields} from "@/domains/movie-reviews/_models";

/** Configuration parameters for fetching aggregated customer profile data. */
export type FetchCustomerProfileViewDataConfig = {
    uniqueCode: UserUniqueCode
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

/** Configuration for fetching a specific review context for a customer. */
export type FetchCustomerReviewViewDataConfig = {
    customerCode: UserUniqueCode
    reviewCode: MovieReviewUniqueCode
}

/** Detailed view data for a single customer review including customer context. */
export type CustomerReviewViewData = {
    customer: LeanUserSchemaFields
    review: MovieReviewSchemaFields
}

/** Configuration for paginated retrieval of all reviews authored by a specific customer. */
export type FetchCustomerReviewsViewDataConfig = {
    customerCode: UserUniqueCode
    pagination: RequestPaginationOptions
}

/** Paginated response structure for a customer's review history. */
export type FetchCustomerReviewsViewData = {
    customer: LeanUserSchemaFields
    reviews: PaginationReturns<CustomerMovieReviewSummary>
}

/** Configuration for retrieving the audit trail of a specific review. */
export type FetchCustomerReviewLogsViewDataConfig = {
    reviewCode: MovieReviewUniqueCode
    pagination: RequestPaginationOptions
}

/** Paginated moderation log entries for administrative oversight. */
export type FetchCustomerReviewLogsViewData = PaginationReturns<MovieReviewModerationLogSchemaFields>