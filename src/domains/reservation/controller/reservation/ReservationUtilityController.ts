/**
 * @file fetchReservationsForUser.controller.ts
 *
 * Controller for retrieving paginated reservation data
 * for the authenticated user.
 *
 * This endpoint is intended for:
 * - User account dashboards
 * - Reservation history views
 *
 * Authorization is based on the presence of `req.authUserID`,
 * which must be populated by upstream authentication middleware.
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "../../../../shared/types/ControllerTypes.js";
import QueryUtils from "../../../../shared/services/query-utils/QueryUtils.js";
import {
    countUserReservations,
    fetchPaginatedUserReservations,
} from "../../modules/ReservationUtils.js";

/**
 * Fetches a paginated list of reservations for the authenticated user.
 *
 * @remarks
 * - Requires authentication middleware to populate `req.authUserID`
 * - Pagination parameters are resolved from query string values
 * - Results are returned in descending order of reservation creation
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response containing paginated reservation data
 */
export const fetchReservationsForUser: ControllerAsyncFunc = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const userID = req.authUserID;

    if (!userID) {
        return res.status(403).json({message: "Unauthorized."});
    }

    const pagination = QueryUtils.fetchPaginationFromQuery(req);

    const [totalItems, items] = await Promise.all([
        countUserReservations(userID),
        fetchPaginatedUserReservations({userID, pagination}),
    ]);

    return res.status(200).json({
        message: "Paginated reservations for authenticated user.",
        totalItems,
        items,
    });
};
