/**
 * @file Express controller for handling requests to retrieve aggregated customer profile views.
 * @filename controller.ts
 */

import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import type {Request, Response} from "express";
import {fetchCustomerProfileViewData} from "@domains/customer/features/customer-details/services";

/**
 * Standardized Express controller that resolves a customer's full profile activity.
 * ---
 * @param req - The Express Request object containing the customer's unique code in `req.params`.
 * @param res - The Express Response object used to send the JSON payload.
 * @returns A promise resolving to the Express Response containing the customer data.
 */
export const getFetchCustomerProfileViewData: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const {uniqueCode} = req.params;

    const data = await fetchCustomerProfileViewData({uniqueCode});

    return res.status(200).json(data);
}