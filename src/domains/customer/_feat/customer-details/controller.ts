/**
 * @fileoverview Controller handling data retrieval requests for the customer details management feature.
 */

import type {Request, Response} from "express"
import {
    fetchCustomerProfileViewData, fetchCustomerReservationsViewData, fetchCustomerReservationViewData,
    fetchCustomerReviewsViewData,
    fetchCustomerReviewViewData
} from "@/domains/customer/_feat/customer-details/service"
import {fetchRequestPaginationOptions} from "@/shared/_feat/fetch-request-options/utils"
import {
    fetchCustomerReviewLogsViewData
} from "@/domains/customer/_feat/customer-details/service/fetchCustomerReviewLogsViewData";
import type {
    ManageCustomerReservationRouteConfig,
    ManageCustomerReviewRouteConfig,
    ManageCustomerRouteConfig
} from "@/domains/customer/_feat/customer-details/schema";

/** Fetches the profile view data for a specific customer. */
export async function getFetchCustomerProfileViewData(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageCustomerRouteConfig;

    const data = await fetchCustomerProfileViewData({userId});
    return res.status(200).json(data);
}

/** Fetches a paginated list of reviews authored by a specific customer. */
export async function getFetchCustomerReviewsViewData(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageCustomerRouteConfig;
    const {page, perPage} = fetchRequestPaginationOptions(req);

    const data = await fetchCustomerReviewsViewData({userId, pagination: {page, perPage}});
    return res.status(200).json(data);
}

/** Fetches detailed view data for a specific customer review. */
export async function getFetchCustomerReviewViewData(req: Request, res: Response): Promise<Response> {
    const {userId, reviewId} = req.parsedConfig as ManageCustomerReviewRouteConfig;

    const data = await fetchCustomerReviewViewData({userId, reviewId});
    return res.status(200).json(data);
}

/** Fetches paginated audit logs for a specific customer review. */
export async function getFetchCustomerReviewLogsViewData(req: Request, res: Response): Promise<Response> {
    const {userId, reviewId} = req.parsedConfig as ManageCustomerReviewRouteConfig;
    const pagination = fetchRequestPaginationOptions(req);

    const data = await fetchCustomerReviewLogsViewData({userId, reviewId, pagination});
    return res.status(200).json(data);
}

/** Fetches a paginated list of reservations made by a specific customer. */
export async function getFetchCustomerReservationsViewData(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageCustomerRouteConfig;
    const {page, perPage} = fetchRequestPaginationOptions(req);

    const data = await fetchCustomerReservationsViewData({userId, pagination: {page, perPage}});
    return res.status(200).json(data);
}

/** Fetches detailed view data for a specific customer reservation. */
export async function getFetchCustomerReservationViewData(req: Request, res: Response): Promise<Response> {
    const {userId, reservationId} = req.parsedConfig as ManageCustomerReservationRouteConfig;

    const data = await fetchCustomerReservationViewData({userId, reservationId});
    return res.status(200).json(data);
}