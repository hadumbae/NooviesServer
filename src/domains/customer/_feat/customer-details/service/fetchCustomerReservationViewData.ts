/**
 * @fileoverview Service for fetching customer and reservation data for the customer details view.
 */

import {Types} from "mongoose";
import {LeanUserQuerySelectFields, type LeanUserSchemaFields, User} from "@/domains/users";
import createHttpError from "http-errors";
import {Reservation, type ReservationSchemaFields} from "@/domains/reservations";

/** Configuration for fetching customer reservation view data. */
export type FetchCustomerReservationViewDataConfig = {
    userId: Types.ObjectId;
    reservationId: Types.ObjectId;
}

/** Composite data structure for the customer reservation view. */
export type FetchCustomerReservationViewData = {
    customer: LeanUserSchemaFields;
    reservation: ReservationSchemaFields;
}

/** Fetches customer and reservation documents by their respective identifiers. */
export async function fetchCustomerReservationViewData(
    {userId, reservationId}: FetchCustomerReservationViewDataConfig
): Promise<FetchCustomerReservationViewData> {
    const customer = await User
        .findById(userId)
        .select(LeanUserQuerySelectFields)
        .lean();

    if (!customer) {
        throw createHttpError(404, "Customer Not Found.");
    }

    const reservation = await Reservation
        .findById(reservationId)
        .populate({path: "user", select: LeanUserQuerySelectFields})
        .lean();

    if (!reservation) {
        throw createHttpError(404, "Reservation Not Found.");
    }

    return {
        customer,
        reservation,
    }
}