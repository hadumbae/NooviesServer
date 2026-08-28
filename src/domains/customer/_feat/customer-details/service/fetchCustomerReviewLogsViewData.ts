/**
 * @fileoverview Service for retrieving paginated moderation audit logs for specific movie reviews.
 */

import type {PaginationReturns} from "@/shared/_types/pagination/PaginationReturns";
import type {
    MovieReviewModerationLogSchemaFields
} from "@/domains/movie-reviews/_models/moderationLogs/MovieReviewModerationLog.types";
import {MovieReview} from "@/domains/movie-reviews/_models/review/MovieReview.model";
import {MovieReviewModerationLog} from "@/domains/movie-reviews/_models/moderationLogs/MovieReviewModerationLog.model";
import type {
    RequestPaginationOptions
} from "@/shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema";
import {Types} from "mongoose";
import {LeanUserQuerySelectFields, User, type UserSchemaFields} from "@/domains/users";
import {MovieReviewPopulatePaths, type MovieReviewSchemaFields} from "@/domains/movie-reviews";
import createHttpError from "http-errors";

/** Configuration for retrieving the audit trail of a specific review. */
export type FetchCustomerReviewLogsViewDataConfig = {
    userId: Types.ObjectId;
    reviewId: Types.ObjectId;
    pagination: RequestPaginationOptions
}

/** Paginated moderation log entries for administrative oversight. */
export type FetchCustomerReviewLogsViewData = {
    customer: UserSchemaFields;
    review: MovieReviewSchemaFields;
    logs: PaginationReturns<MovieReviewModerationLogSchemaFields>;
}

/**
 * Retrieves a paginated list of moderation audit logs for a specific review,
 * populating the details of the performing administrator.
 */
export async function fetchCustomerReviewLogsViewData(
    {userId, reviewId, pagination: {page, perPage}}: FetchCustomerReviewLogsViewDataConfig
): Promise<FetchCustomerReviewLogsViewData> {
    const customer = await User
        .findById(userId)
        .select(LeanUserQuerySelectFields)
        .lean();

    if (!customer) {
        throw createHttpError(404, "User Not Found.");
    }

    const review = await MovieReview
        .findById(reviewId)
        .populate(MovieReviewPopulatePaths)
        .lean();

    if (!review) {
        throw createHttpError(404, "Movie Review Not Found.");
    }

    const [totalItems, items] = await Promise.all([
        MovieReviewModerationLog.countDocuments({review: review._id}),
        MovieReviewModerationLog
            .find({review: review._id})
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate({path: "admin", select: LeanUserQuerySelectFields})
    ]);

    return {
        customer,
        review,
        logs: {totalItems, items},
    }
}