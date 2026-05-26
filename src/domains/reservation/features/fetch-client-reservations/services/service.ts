/**
 * @fileoverview Service for retrieving paginated reservation history for client-side users.
 */

import type {FetchPaginatedUserReservationsParams} from "./service.types";
import type {PaginationReturns} from "@shared/types/PaginationReturns";
import {ReservationPopulateRefs} from "@domains/reservation/constants";
import {Reservation, type ReservationSchemaFields} from "@domains/reservation/model/reservation";

/** Retrieves a paginated collection of reservations belonging to a specific user. */
export const fetchPaginatedUserReservations = async (
    {userID, pagination: {page, perPage}}: FetchPaginatedUserReservationsParams
): Promise<PaginationReturns<ReservationSchemaFields>> => {
    const countQuery = Reservation.countDocuments({user: userID});

    const itemQuery = Reservation
        .find({user: userID})
        .sort({dateReserved: -1})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate(ReservationPopulateRefs)
        .lean();

    /** Execute both queries concurrently to maximize throughput. */
    const [totalItems, items] = await Promise.all([
        countQuery,
        itemQuery,
    ]);

    return {
        totalItems,
        items,
    };
};