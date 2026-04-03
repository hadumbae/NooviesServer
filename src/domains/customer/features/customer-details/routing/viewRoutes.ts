/**
 * @file Router configuration for customer-specific data aggregation views.
 * @filename viewRoutes.ts
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {getFetchCustomerProfileViewData} from "@domains/customer/features/customer-details/controllers";

/**
 * Express Router instance for Customer view data.
 * ---
 */
const router = Router();

/**
 * GET /profile-details - Aggregates user identity, recent reservations, and reviews.
 * ---
 */
router.get(
    "profile-details",
    [isAuth],
    asyncHandler(getFetchCustomerProfileViewData)
)

export {
    router as CustomerViewDataRoutes
}