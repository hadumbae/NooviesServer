/**
 * @fileoverview Controller for fetching paginated reservations for the authenticated user.
 */

import type {Request, Response} from "express";
import QueryUtils from "@/shared/services/query-utils/QueryUtils";
import {fetchRequestUser} from "@/shared/utility/request/fetchRequestUser";
import {
    type CurrentUserReservationQueryFilters,
    type CurrentUserReservationQuerySorts,
    fetchPaginatedUserReservations,
} from "@/domains/reservations/_feat/fetch-client-reservations/current-user-reservations";

/** Controller that retrieves and returns a paginated list of reservations for the currently authenticated user. */
export async function fetchReservationsForUser(req: Request, res: Response): Promise<Response> {
    const userID = fetchRequestUser(req);
    const pagination = QueryUtils.fetchPaginationFromQuery(req);

    const filters = req.queryFilters as CurrentUserReservationQueryFilters;
    const sorts = req.querySorts as CurrentUserReservationQuerySorts;

    const {totalItems, items} = await fetchPaginatedUserReservations({
        userID,
        pagination,
        filters,
        sorts,
    });

    return res.status(200).json({
        message: "Paginated reservations for authenticated user.",
        totalItems,
        items,
    });
}