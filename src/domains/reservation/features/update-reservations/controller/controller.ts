/**
 * @file Express controller for handling HTTP PATCH requests to update reservations.
 * @filename controller.ts
 */

import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import type {Request, Response} from "express";
import {updateReservationNotes} from "@domains/reservation/features/update-reservations/service";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";

/**
 * Handles the partial update of a reservation's administrative notes.
 * @param req - Express request object containing the reservation ID in params and notes in the body.
 * @param res - Express response object used to send the updated JSON payload.
 * @returns A promise resolving to the Express response.
 */
export const patchUpdateReservationNotes: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const data = req.validatedBody;
    const {_id} = req.params;

    const reservationID = isValidObjectId(_id);

    const reservation = await updateReservationNotes({
        reservationID,
        data,
    });

    return res.status(200).json(reservation);
}