/**
 * @file TicketController.ts
 *
 * HTTP controllers for ticket reservation workflows.
 *
 * Exposes client-facing endpoints used during
 * checkout and reservation creation.
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "../../../../shared/types/ControllerTypes.js";
import {reserveTickets} from "../../modules/TicketReservationUtils.js";
import type {ReserveTicketSubmitData} from "../../schemas/reserve-ticket/ReserveTicket.submit.schema.js";

/**
 * Creates a reservation for the authenticated client.
 *
 * @remarks
 * - Requires an authenticated user
 * - Assumes request body has been validated upstream
 * - Delegates reservation orchestration to the domain layer
 *
 * @returns
 * - `200 OK` with the created reservation on success
 * - `403 Forbidden` when the user is not authenticated
 */
export const makeReservationForClient: ControllerAsyncFunc = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const userID = req.authUserID;
    if (!userID) {
        return res.status(403).json({message: "Unauthorized."});
    }

    const data = req.validatedBody as ReserveTicketSubmitData;
    const reservation = await reserveTickets({userID, data});

    return res
        .status(200)
        .json(reservation);
};
