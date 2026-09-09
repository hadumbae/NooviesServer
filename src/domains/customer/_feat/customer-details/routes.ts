/**
 * @fileoverview Defines the Express routes for the customer details administrative view.
 */

import {Router} from "express"
import {isAuth} from "@/domains/authentication/_middleware/isAuth"
import {isAdmin} from "@/domains/authentication/_middleware/isAdmin"
import asyncHandler from "@/shared/utility/handlers/asyncHandler"
import {
    getFetchCustomerProfileViewData, getFetchCustomerReservationsViewData, getFetchCustomerReservationViewData,
    getFetchCustomerReviewLogsViewData,
    getFetchCustomerReviewsViewData,
    getFetchCustomerReviewViewData
} from "@/domains/customer/_feat/customer-details/controller"
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {
    ManageCustomerReservationRouteConfigSchema,
    ManageCustomerReviewRouteConfigSchema,
    ManageCustomerRouteConfigSchema
} from "@/domains/customer/_feat/customer-details/schema";

const router = Router()

router.get(
    "/customer/:userId",
    [isAuth, isAdmin, validateRequestConfig({schema: ManageCustomerRouteConfigSchema})],
    asyncHandler(getFetchCustomerProfileViewData)
);

router.get(
    "/customer/:userId/reviews",
    [isAuth, isAdmin, validateRequestConfig({schema: ManageCustomerRouteConfigSchema})],
    asyncHandler(getFetchCustomerReviewsViewData)
);

router.get(
    "/customer/:userId/review/:reviewId",
    [isAuth, isAdmin, validateRequestConfig({schema: ManageCustomerReviewRouteConfigSchema})],
    asyncHandler(getFetchCustomerReviewViewData)
);

router.get(
    "/customer/:userId/review/:reviewId/logs",
    [isAuth, isAdmin, validateRequestConfig({schema: ManageCustomerReviewRouteConfigSchema})],
    asyncHandler(getFetchCustomerReviewLogsViewData)
);

router.get(
    "/customer/:userId/reservations",
    [isAuth, isAdmin, validateRequestConfig({schema: ManageCustomerRouteConfigSchema})],
    asyncHandler(getFetchCustomerReservationsViewData)
);

router.get(
    "/customer/:userId/reservations/:reservationId",
    [isAuth, isAdmin, validateRequestConfig({schema: ManageCustomerReservationRouteConfigSchema})],
    asyncHandler(getFetchCustomerReservationViewData)
);

/** Express router for customer administration data fetching. */
export {
    router as CustomerAdminViewDataRoutes
}