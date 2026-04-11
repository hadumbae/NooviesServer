/**
 * @fileoverview Defines the router configuration for customer-specific data
 * aggregation views. Maps HTTP endpoints to controllers for fetching
 * profiles, reviews, and moderation logs.
 */

import {Router} from "express"
import isAuth from "@domains/authentication/middleware/isAuth"
import asyncHandler from "@shared/utility/handlers/asyncHandler"
import {
    getFetchCustomerProfileViewData,
    getFetchCustomerReviewsViewData,
    getFetchCustomerReviewViewData
} from "@domains/customer/features/customer-details/controllers"
import {getFetchCustomerReviewLogsViewData} from "@domains/customer/features/customer-details/controllers/controller"

/**
 * Express Router instance for aggregating Customer activity and identity views.
 */
const router = Router()

/**
 * GET /profile-details/:uniqueCode
 * Resolves a customer's full profile activity.
 */
router.get(
    "/profile-details/:uniqueCode",
    [isAuth],
    asyncHandler(getFetchCustomerProfileViewData)
)

/**
 * GET /profile-details/:customerCode/reviews
 * Fetches a paginated list of all reviews authored by a specific customer.
 */
router.get(
    "/profile-details/:customerCode/reviews",
    [isAuth],
    asyncHandler(getFetchCustomerReviewsViewData)
)

/**
 * GET /profile-details/:customerCode/review/:reviewCode
 * Retrieves the full context for a specific movie review.
 */
router.get(
    "/profile-details/:customerCode/review/:reviewCode",
    [isAuth],
    asyncHandler(getFetchCustomerReviewViewData)
)

/**
 * GET /profile-details/:customerCode/review/:reviewCode/logs
 * Retrieves paginated moderation logs for a specific review.
 */
router.get(
    "/profile-details/:customerCode/review/:reviewCode/logs",
    [isAuth],
    asyncHandler(getFetchCustomerReviewLogsViewData)
)

export {
    router as CustomerViewDataRoutes
}