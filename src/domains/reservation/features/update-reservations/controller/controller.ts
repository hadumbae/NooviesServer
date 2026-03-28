/**
 * @file Express controllers for handling reservation update requests.
 * @filename controller.ts
 */

import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import type {Request, Response} from "express";
import {
    resetReservationExpiry,
    updateReservationNotes
} from "@domains/reservation/features/update-reservations/service";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";

/**
 * Handles the partial update of a reservation's administrative notes.
 * @param req - Express request containing the reservation `_id` in params and notes in the body.
 * @param res - Express response object.
 * @returns A promise resolving to a `200 OK` response with the updated reservation.
 */
export const patchUpdateReservationNotes: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const data = req.validatedBody;
    const {_id} = req.params;

    /** Ensure the ID string is a valid BSON format before hitting the service. */
    const reservationID = isValidObjectId(_id);

    const reservation = await updateReservationNotes({
        reservationID,
        data,
    });

    return res.status(200).json(reservation);
}

/**
 * Resets the expiration timer for a pending reservation.
 * @param req - Express request containing the reservation `_id` in params.
 * @param res - Express response object.
 * @returns A promise resolving to a `200 OK` response with the new expiration timestamp.
 */
export const patchResetReservationExpiry: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const {_id} = req.params;

    /** Convert URL parameter to typed ObjectId. */
    const reservationID = isValidObjectId(_id);

    const reservation = await resetReservationExpiry({
        reservationID,
        duration: {days: 1},
    });

    return res.status(200).json(reservation);
}