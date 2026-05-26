/**
 * @fileoverview Service layer for administrative-level reservation retrieval and data hydration.
 */

import type {FetchReservationByCodeParams} from "@domains/reservation/_feat/fetch-customer-reservations/service/service.types";
import type {AdminReservation} from "@domains/reservation/_feat/fetch-customer-reservations";
import {Reservation} from "@domains/reservation/model/reservation";

/** Retrieves a single reservation by its unique identifier and populates basic user information. */
export const fetchByUniqueCode = async (
    {uniqueCode}: FetchReservationByCodeParams
): Promise<AdminReservation | null> => {
    return Reservation
        .findOne({uniqueCode})
        .populate({path: "user", select: "_id name email uniqueCode"})
        .lean<AdminReservation>();
}