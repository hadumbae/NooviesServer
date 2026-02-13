/**
 * @file TicketController.ts
 * HTTP controllers for client-facing reservation workflows.
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "../../../shared/types/ControllerTypes.js";
import {reserveTickets} from "../modules/tickets/TicketReservationUtils.js";
import type {ReserveTicketSubmitData} from "../schemas/reserve-ticket/ReserveTicket.submit.schema.js";
import {checkoutReservation} from "../services/ticket-checkout/TicketCheckoutService.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import {fetchRequestUser} from "../../../shared/utility/request/fetchRequestUser.js";
import {cancelReservation} from "../services/reservation/ReservationService.js";

/**
 * Creates a reservation for the authenticated user.
 *
 * @remarks
 * Requires a validated request body.
 */
export const makeReservationForClient: ControllerAsyncFunc = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);

    const data = req.validatedBody as ReserveTicketSubmitData;
    const reservation = await reserveTickets({userID, data});

    return res.status(200).json(reservation);
};

/**
 * Finalizes checkout for an existing reservation.
 *
 * @remarks
 * Reservation identifier must be provided via route params.
 */
export const checkoutReservationForClient: ControllerAsyncFunc = async (
    req: Request,
    res: Response
) => {
    const userID = fetchRequestUser(req);

    const {resID} = req.params;
    const reservationID = isValidObjectId(resID);

    const reservation = await checkoutReservation({
        userID,
        reservationID,
    });

    return res.status(200).json(reservation);
};

/**
 * Cancels an existing reservation for the authenticated user.
 *
 * @remarks
 * Reserved seating is released when applicable.
 */
export const cancelReservationForClient: ControllerAsyncFunc = async (
    req: Request,
    res: Response,
) => {
    const userID = fetchRequestUser(req);

    const {resID} = req.params;
    const reservationID = isValidObjectId(resID);

    const reservation = cancelReservation({userID, resID: reservationID});
    return res.status(200).json(reservation);
}
