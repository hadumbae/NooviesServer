/**
 * @fileoverview Express controllers for client-side reservation lifecycle management.
 */

import type {Request, Response} from "express";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";
import {fetchRequestUser} from "@shared/utility/request/fetchRequestUser";
import {cancelClientReservation, checkoutClientReservation} from "@domains/reservation/_feat/update-client-reservations/services";

/**
 * Finalizes a pending reservation hold for a client.
 */
export async function patchCheckoutClientReservation(req: Request, res: Response): Promise<Response> {
    const userID = fetchRequestUser(req);

    const {resID} = req.params;
    const reservationID = isValidObjectId(resID);

    const reservation = await checkoutClientReservation({
        userID,
        reservationID,
    });

    return res.status(200).json(reservation);
}

/**
 * Processes a user-initiated cancellation of an existing reservation.
 */
export async function patchCancelClientReservation(req: Request, res: Response,): Promise<Response> {
    const userID = fetchRequestUser(req);

    const {resID} = req.params;
    const reservationID = isValidObjectId(resID);

    const reservation = await cancelClientReservation({
        userID,
        reservationID: reservationID
    });

    return res.status(200).json(reservation);
}