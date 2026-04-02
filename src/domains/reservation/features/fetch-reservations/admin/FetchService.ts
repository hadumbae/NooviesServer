/**
 * @file Service layer for administrative-level Reservation retrieval and data hydration.
 * @filename FetchService.ts
 */


import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import type {AdminReservation} from "@domains/reservation/features/fetch-reservations/admin/types/AdminReservation";
import type {FetchReservationByCodeParams} from "@domains/reservation/features/fetch-reservations/admin/FetchService.types";

/**
 * Retrieves a single reservation by its unique identifier and populates basic user information.
 * @param params - Configuration containing the target `uniqueCode`.
 * @returns {Promise<AdminReservation | null>} A hydrated reservation object or `null` if no match is found.
 */
export const fetchByUniqueCode = async (
    {uniqueCode}: FetchReservationByCodeParams
): Promise<AdminReservation | null> => {
    return Reservation
        .findOne({uniqueCode})
        .populate({path: "user", select: "_id name email uniqueCode"})
        .lean<AdminReservation>();
}