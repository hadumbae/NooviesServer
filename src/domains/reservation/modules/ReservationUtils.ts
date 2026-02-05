/**
 * @file ReservationUtils.ts
 *
 * Shared read-only utilities for querying reservation data.
 *
 * This module is intended for:
 * - User-facing reservation history
 * - Paginated dashboard views
 * - Administrative inspection
 *
 * Write operations and state transitions should live elsewhere.
 */

import Reservation from "../model/reservation/Reservation.model.js";
import {TicketReservationPopulateRefs} from "../constants/TicketReservationPopulateRefs.js";
import type {FetchPaginatedUserReservationsParams} from "./ReservationUtils.types.js";
import {Types} from "mongoose";
import type {ReservationSchemaFields} from "../model/reservation/Reservation.types.js";

export const countUserReservations = async (userID: Types.ObjectId): Promise<number> => {
    return Reservation.countDocuments({user: userID});
}

/**
 * Fetches a paginated list of reservations for a specific user.
 *
 * @remarks
 * - Results are ordered by `dateReserved` (most recent first)
 * - Applies standard reservation population via `TicketReservationPopulateRefs`
 * - Uses `.lean()` to return plain objects and avoid document mutation
 * - Intended for read-only workflows
 *
 * @param params - User identifier and pagination configuration
 * @returns A paginated list of populated, lean reservation records
 */
export const fetchPaginatedUserReservations = async (
    {userID, pagination: {page, perPage}}: FetchPaginatedUserReservationsParams
): Promise<ReservationSchemaFields[]> => {
    return Reservation
        .find({user: userID})
        .sort({dateReserved: -1})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate(TicketReservationPopulateRefs)
        .lean();
};
