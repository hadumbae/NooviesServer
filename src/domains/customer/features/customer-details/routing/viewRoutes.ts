/**
 * @file Router configuration for customer-specific data aggregation views.
 * @filename viewRoutes.ts
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {
    getFetchCustomerProfileViewData,
    getFetchCustomerReviewViewData
} from "@domains/customer/features/customer-details/controllers";

/**
 * Express Router instance for aggregating Customer activity and identity views.
 * ---
 * ### Mechanics
 * * **Security:** All routes are protected by the {@link isAuth} middleware,
 * ensuring that only authenticated users can access profile aggregation data.
 * * **Error Handling:** Wraps controllers in {@link asyncHandler} to capture
 * rejected promises and pass them to the global Express error-handling stack.
 * * **Route Granularity:** Separates high-level profile summaries from
 * deep-dive review details, supporting both the main profile page and
 * specific moderation/detail views.
 * ---
 */
const router = Router();

/**
 * GET /profile-details/:uniqueCode
 * ---
 */
router.get(
    "/profile-details/:uniqueCode",
    [isAuth],
    asyncHandler(getFetchCustomerProfileViewData)
);

/**
 * GET /profile-details/:customerCode/review/:reviewCode
 * ---
 */
router.get(
    "/profile-details/:customerCode/review/:reviewCode",
    [isAuth],
    asyncHandler(getFetchCustomerReviewViewData)
);

export {
    router as CustomerViewDataRoutes
};