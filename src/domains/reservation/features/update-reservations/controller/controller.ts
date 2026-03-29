/**
 * @file Express controllers for handling reservation update requests.
 * @filename controller.ts
 */

import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import type {Request, Response} from "express";
import {
    cancelReservation, refundReservation,
    resetReservationExpiry,
    updateReservationNotes
} from "@domains/reservation/features/update-reservations/service";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";

/**
 * Handles the partial update of a reservation's administrative notes.
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

/**
 * Transitions a reservation to a cancelled state.
 */
export const patchCancelReservation: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const data = req.validatedBody;
    const {_id} = req.params;

    const reservationID = isValidObjectId(_id);

    const reservation = await cancelReservation({
        reservationID,
        data,
    });

    return res.status(200).json(reservation);
}

export const patchRefundReservation: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const data = req.validatedBody;
    const {_id} = req.params;

    const reservationID = isValidObjectId(_id);

    const reservation = await refundReservation({
        reservationID,
        data,
    });

    return res.status(200).json(reservation);
}