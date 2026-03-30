import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import type {Request, Response} from "express";
import {fetchRequestUser} from "@shared/utility/request/fetchRequestUser";
import {reserveTickets} from "@domains/reservation/features/reserve-tickets/services";
import type {ReserveTicketInputData} from "@domains/reservation/features/reserve-tickets/schemas";

/**
 * Creates a reservation for the authenticated user.
 *
 * @remarks
 * Requires a validated request body.
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