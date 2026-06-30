/**
 * @fileoverview Express controller for retrieving customer reservations via unique codes.
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "@/shared/types/ControllerTypes.js";
import {fetchByUniqueCode} from "src/domains/reservations/_feat/fetch-customer-reservations/service";

/** Retrieves a single reservation using the unique code provided in the request parameters. */
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