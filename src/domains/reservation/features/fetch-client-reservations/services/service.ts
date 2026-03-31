/**
 * @file Service for retrieving paginated reservation history for client-side users.
 * @filename service.ts
 */

import Reservation from "../../../model/reservation/Reservation.model";
import type {FetchPaginatedUserReservationsParams} from "./service.types";
import type {ReservationSchemaFields} from "../../../model/reservation/Reservation.types";
import type {PaginationReturns} from "@shared/types/PaginationReturns";
import {ReservationPopulateRefs} from "@domains/reservation/constants";

/**
 * Retrieves a paginated collection of reservations belonging to a specific user.
 * @param params - Configuration containing the `userID` and standard `pagination` offsets.
 * @returns A promise resolving to a {@link PaginationReturns} object containing the item
 * slice and total count.
 * @throws {Error} If the database query fails or the connection is interrupted.
 */
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