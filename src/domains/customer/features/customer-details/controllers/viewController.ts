/**
 * @file Express controllers for resolving aggregated customer activity and review data.
 * @filename controller.ts
 */

import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import type {Request, Response} from "express";
import {
    fetchCustomerProfileViewData,
    fetchCustomerReviewViewData
} from "@domains/customer/features/customer-details/services";

/**
 * Standardized Express controller that resolves a customer's full profile activity.
 * ---
 * @param req - The Express Request object containing `uniqueCode` in `req.params`.
 * @param res - The Express Response object used to send the JSON payload.
 * @returns {Promise<Response>} Resolves to a JSON response of {@link CustomerProfileViewData}.
 */
export const getFetchCustomerProfileViewData: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const {uniqueCode} = req.params;

    const data = await fetchCustomerProfileViewData({uniqueCode});

    return res.status(200).json(data);
};

/**
 * Express controller for retrieving a specific review within a customer's context.
 * ---
 * @param req - The Express Request object containing customer and review codes.
 * @param res - The Express Response object.
 * @returns {Promise<Response>} Resolves to a JSON response of {@link CustomerReviewViewData}.
 */
export const getFetchCustomerReviewViewData: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const {customerCode, reviewCode} = req.params;

    const data = await fetchCustomerReviewViewData({
        customerCode,
        reviewCode,
    });

    return res.status(200).json(data);
};