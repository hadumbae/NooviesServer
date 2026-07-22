/**
 * @fileoverview Service for fetching paginated reservation data for the currently authenticated user.
 */

import {Types} from "mongoose";
import type {PaginationReturns} from "@/shared/_types/pagination/PaginationReturns";
import {Reservation, type ReservationSchemaFields} from "@/domains/reservations/_model/reservation";
import {ReservationPopulatePaths} from "@/domains/reservations/_feat/query-population";
import type {QueryPaginationParams} from "@/shared/schema/query/QueryPaginationParamsSchema";
import type {CurrentUserReservationQueryFilters, CurrentUserReservationQuerySorts} from "@/domains/reservations";

/** Parameters for fetching paginated user reservations. */
export type FetchPaginatedUserReservationsParams = {
    userID: Types.ObjectId;
    pagination: QueryPaginationParams;
    filters?: CurrentUserReservationQueryFilters;
    sorts?: CurrentUserReservationQuerySorts;
};

/** Retrieves a paginated list of reservations for a specific user based on filters and sorting. */
export const fetchPaginatedUserReservations = async (
    {userID, filters, sorts, pagination: {page, perPage}}: FetchPaginatedUserReservationsParams
): Promise<PaginationReturns<ReservationSchemaFields>> => {
    const countQuery = Reservation.countDocuments({user: userID});

    const itemQuery = Reservation
        .find({...filters, user: userID})
        .sort(sorts ?? {dateReserved: -1})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate(ReservationPopulatePaths)
        .lean();

    const [totalItems, items] = await Promise.all([
        countQuery,
        itemQuery,
    ]);

    return {
        totalItems,
        items,
    };
};