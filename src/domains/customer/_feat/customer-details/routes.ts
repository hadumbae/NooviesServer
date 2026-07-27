/**
 * @fileoverview Defines the router configuration for customer-specific data
 * aggregation views. Maps HTTP endpoints to controllers for fetching
 * profiles, reviews, and moderation logs.
 */

import {Router} from "express"
import {isAuth} from "@/domains/authentication/middleware/isAuth"
import asyncHandler from "@/shared/utility/handlers/asyncHandler"
import {
    getFetchCustomerProfileViewData,
    getFetchCustomerReviewLogsViewData,
    getFetchCustomerReviewsViewData,
    getFetchCustomerReviewViewData
} from "@/domains/customer/_feat/customer-details/controller"
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {
    ManageCustomerReviewRouteConfigSchema,
    ManageCustomerRouteConfigSchema
} from "@/domains/customer/_feat/customer-details/schema";

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
    "/customer/:userID/reviews",
    // "/profile-details/:customerCode/reviews",
    [isAuth, validateRequestConfig({schema: ManageCustomerRouteConfigSchema})],
    asyncHandler(getFetchCustomerReviewsViewData)
)

/**
 * GET /profile-details/:customerCode/review/:reviewCode
 * Retrieves the full context for a specific movie review.
 */
router.get(
    "/customer/:userID/review/:reviewId",
    // "/profile-details/:customerCode/review/:reviewCode",
    [isAuth, validateRequestConfig({schema: ManageCustomerReviewRouteConfigSchema})],
    asyncHandler(getFetchCustomerReviewViewData)
)

/**
 * GET /profile-details/:customerCode/review/:reviewCode/logs
 * Retrieves paginated moderation logs for a specific review.
 */
router.get(
    "/customer/:userID/review/:reviewId/logs",
    // "/profile-details/:customerCode/review/:reviewCode/logs",
    [isAuth, validateRequestConfig({schema: ManageCustomerReviewRouteConfigSchema})],
    asyncHandler(getFetchCustomerReviewLogsViewData)
)

export {
    router as CustomerViewDataRoutes
}