/**
 * @file Express controllers for client-side reservation lifecycle management.
 * @filename controller.ts
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";
import {fetchRequestUser} from "@shared/utility/request/fetchRequestUser";
import {
    cancelClientReservation,
    checkoutClientReservation
} from "@domains/reservation/features/client-reservations/services";

/**
 * Handles the checkout (finalization) of a pending reservation hold.
 */
export const patchCheckoutClientReservation: ControllerAsyncFunc = async (
    req: Request,
    res: Response
) => {
    const userID = fetchRequestUser(req);

    const {resID} = req.params;
    const reservationID = isValidObjectId(resID);

    const reservation = await checkoutClientReservation({
        userID,
        reservationID,
    });

    return res.status(200).json(reservation);
};

/**
 * Handles user-initiated cancellation of a reservation.
 */
export const patchCancelClientReservation: ControllerAsyncFunc = async (
    req: Request,
    res: Response,
) => {
    const userID = fetchRequestUser(req);

    const {resID} = req.params;
    const reservationID = isValidObjectId(resID);

    const reservation = await cancelClientReservation({
        userID,
        reservationID: reservationID
    });

    return res.status(200).json(reservation);
}