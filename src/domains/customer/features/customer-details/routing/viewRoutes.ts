/**
 * @file Router configuration for customer-specific data aggregation views.
 * @filename viewRoutes.ts
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {
    getFetchCustomerProfileViewData,
    getFetchCustomerReviewsViewData,
    getFetchCustomerReviewViewData
} from "@domains/customer/features/customer-details/controllers";

/**
 * Express Router instance for aggregating Customer activity and identity views.
 * ---
 */
const router = Router();

/**
 * GET /profile-details/:uniqueCode
 * ---
 * Resolves a customer's full profile activity including identity, reservations, and review summaries.
 */
router.get(
    "/profile-details/:uniqueCode",
    [isAuth],
    asyncHandler(getFetchCustomerProfileViewData)
);

/**
 * GET /profile-details/:customerCode/reviews
 * ---
 * Fetches a paginated list of all reviews authored by a specific customer.
 */
router.get(
    "/profile-details/:customerCode/reviews",
    [isAuth],
    asyncHandler(getFetchCustomerReviewsViewData)
);

/**
 * GET /profile-details/:customerCode/review/:reviewCode
 * ---
 * Retrieves the full context for a specific movie review, including author metadata.
 */
router.get(
    "/profile-details/:customerCode/review/:reviewCode",
    [isAuth],
    asyncHandler(getFetchCustomerReviewViewData)
);

export {
    router as CustomerViewDataRoutes
};