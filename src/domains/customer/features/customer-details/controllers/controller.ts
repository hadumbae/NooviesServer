/**
 * @fileoverview Defines Express controllers for resolving
 * aggregated customer activity and review data.
 */

import type {Request, Response} from "express"
import {
    fetchCustomerProfileViewData,
    fetchCustomerReviewsViewData,
    fetchCustomerReviewViewData
} from "@domains/customer/features/customer-details/services"
import {fetchCustomerReviewLogsViewData} from "@domains/customer/features/customer-details/services/service"
import {fetchRequestPaginationOptions} from "@shared/features/fetch-request-options/utils"

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
    const {customerCode} = req.params
    const {page, perPage} = fetchRequestPaginationOptions(req)

    const data = await fetchCustomerReviewsViewData({customerCode, pagination: {page, perPage}});
    return res.status(200).json(data)
}

/**
 * Retrieves a specific review within a customer's context using provided
 * identifier codes.
 */
export async function getFetchCustomerReviewViewData(req: Request, res: Response): Promise<Response> {
    const {customerCode, reviewCode} = req.params

    const data = await fetchCustomerReviewViewData({customerCode, reviewCode})
    return res.status(200).json(data)
}

/**
 * Resolves paginated moderation audit logs for a specific movie review.
 */
export async function getFetchCustomerReviewLogsViewData(req: Request, res: Response): Promise<Response> {
    const {reviewCode} = req.params
    const pagination = fetchRequestPaginationOptions(req)

    const data = await fetchCustomerReviewLogsViewData({reviewCode, pagination})
    return res.status(200).json(data)
}