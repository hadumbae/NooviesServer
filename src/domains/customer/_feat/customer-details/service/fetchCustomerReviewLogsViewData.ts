/**
 * @fileoverview Service for retrieving paginated moderation audit logs for specific movie reviews.
 */

import type {PaginationReturns} from "@/shared/_types/pagination/PaginationReturns";
import type {
    MovieReviewModerationLogSchemaFields
} from "@/domains/movie-reviews/_models/moderationLogs/MovieReviewModerationLog.types";
import {MovieReview} from "@/domains/movie-reviews/_models/review/MovieReview.model";
import {
    MovieReviewModerationLog
} from "@/domains/movie-reviews/_models/moderationLogs/MovieReviewModerationLog.model";
import type {
    RequestPaginationOptions
} from "@/shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema";
import {Types} from "mongoose";

/** Configuration for retrieving the audit trail of a specific review. */
export type FetchCustomerReviewLogsViewDataConfig = {
    reviewId: Types.ObjectId;
    pagination: RequestPaginationOptions
}
/** Paginated moderation log entries for administrative oversight. */
export type FetchCustomerReviewLogsViewData = PaginationReturns<MovieReviewModerationLogSchemaFields>

/**
 * Retrieves a paginated list of moderation audit logs for a specific review,
 * populating the details of the performing administrator.
 */
export async function fetchCustomerReviewLogsViewData(
    {reviewId, pagination: {page, perPage}}: FetchCustomerReviewLogsViewDataConfig
): Promise<FetchCustomerReviewLogsViewData> {
    const review = await MovieReview.findById(reviewId).orFail();

    const [totalItems, items] = await Promise.all([
        MovieReviewModerationLog.countDocuments({review: review._id}),
        MovieReviewModerationLog
            .find({review: review._id})
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate({path: "admin", select: "_id name email uniqueCode"})
    ]);

    return {
        totalItems,
        items,
    }
}