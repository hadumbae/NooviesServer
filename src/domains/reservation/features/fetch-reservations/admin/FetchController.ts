/**
 * @file Express controller for handling administrative reservation retrieval requests.
 * @filename FetchController.ts
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes.js";
import {fetchByUniqueCode} from "@domains/reservation/features/fetch-reservations/admin/FetchService.js";

/**
 * Handles GET requests to retrieve a single reservation using its unique verification code.
 * @param req - The standard Express request object containing the `code` in `req.params`.
 * @param res - The standard Express response object.
 * @returns {Promise<Response>} A JSON payload containing the lookup status and the (optionally) populated reservation.
 */
export const getFetchByUniqueCode: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const {code} = req.params;
    const reservation = await fetchByUniqueCode({uniqueCode: code});

    return res.status(200).json({
        code,
        reservation,
        message: reservation
            ? "Reservation found."
            : "Reservation not found.",
    });
}