/**
 * @fileoverview Defines Express controllers for resolving
 * aggregated customer activity and review data.
 */

import type {Request, Response} from "express"
import {
    fetchCustomerProfileViewData,
    fetchCustomerReviewsViewData,
    fetchCustomerReviewViewData
} from "@/domains/customer/_feat/customer-details/service"
import {fetchRequestPaginationOptions} from "@/shared/_feat/fetch-request-options/utils"
import {
    fetchCustomerReviewLogsViewData
} from "@/domains/customer/_feat/customer-details/service/fetchCustomerReviewLogsViewData";
import type {
    ManageCustomerReviewRouteConfig,
    ManageCustomerRouteConfig
} from "@/domains/customer/_feat/customer-details/schema";

/**
 * Resolves a customer's full profile activity including identity,
 * reservations, and reviews.
 */
export async function getFetchCustomerProfileViewData(req: Request, res: Response): Promise<Response> {
    const {uniqueCode} = req.params

    const data = await fetchCustomerProfileViewData({uniqueCode})
    return res.status(200).json(data)
}

/**
 * Fetches a paginated list of reviews authored by a specific customer based on
 * URL parameters and query strings.
 */
export async function getFetchCustomerReviewsViewData(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageCustomerRouteConfig;
    const {page, perPage} = fetchRequestPaginationOptions(req)

    const data = await fetchCustomerReviewsViewData({userId, pagination: {page, perPage}});
    return res.status(200).json(data)
}

/**
 * Retrieves a specific review within a customer's context using provided
 * identifier codes.
 */
export async function getFetchCustomerReviewViewData(req: Request, res: Response): Promise<Response> {
    const {userId, reviewId} = req.parsedConfig as ManageCustomerReviewRouteConfig;

    const data = await fetchCustomerReviewViewData({userId, reviewId})
    return res.status(200).json(data)
}

/**
 * Resolves paginated moderation audit logs for a specific movie review.
 */
export async function getFetchCustomerReviewLogsViewData(req: Request, res: Response): Promise<Response> {
    const {reviewId} = req.parsedConfig as ManageCustomerReviewRouteConfig;
    const pagination = fetchRequestPaginationOptions(req)

    const data = await fetchCustomerReviewLogsViewData({reviewId, pagination})
    return res.status(200).json(data)
}