/**
 * @fileoverview Controller for handling ticket reservation requests.
 */

import type {ControllerAsyncFunc} from "@/shared/types/ControllerTypes";
import type {Request, Response} from "express";
import {fetchRequestUser} from "@/shared/utility/request/fetchRequestUser";
import type {ReserveTicketInputData} from "src/domains/reservations/_feat/reserve-tickets/schemas";
import {reserveTickets} from "src/domains/reservations/_feat/reserve-tickets/ticket-service";

/**
 * Creates a reservation for the authenticated user using validated request body data.
 */
export const postReserveTickets: ControllerAsyncFunc = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);

    const data = req.validatedBody as ReserveTicketInputData;
    const reservation = await reserveTickets({userID, inputData: data});

    return res.status(200).json(reservation);
};