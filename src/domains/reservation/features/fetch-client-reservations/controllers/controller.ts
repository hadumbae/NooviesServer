/**
 * @file Express controller for fetching an authenticated user's reservation history.
 * @filename controller.ts
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import QueryUtils from "@shared/services/query-utils/QueryUtils";
import {
    fetchPaginatedUserReservations,
} from "../services/service";
import {fetchRequestUser} from "@shared/utility/request/fetchRequestUser";

/**
 * Handles the retrieval of a paginated list of reservations for the current user.
 */
export const fetchReservationsForUser: ControllerAsyncFunc = async (
    req: Request,
    res: Response
): Promise<Response> => {
    /** Retrieve the subject's ID from the security context. */
    const userID = fetchRequestUser(req);

    /** Standardize pagination parameters from the URL. */
    const pagination = QueryUtils.fetchPaginationFromQuery(req);

    /** Delegate database orchestration to the service layer. */
    const {totalItems, items} = await fetchPaginatedUserReservations({userID, pagination});

    return res.status(200).json({
        message: "Paginated reservations for authenticated user.",
        totalItems,
        items,
    });
};