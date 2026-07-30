/**
 * @fileoverview Service for fetching paginated reservations for a specific customer.
 */

import {Types} from "mongoose";
import type {PaginationReturns} from "@/shared/_types/pagination";
import {LeanUserQuerySelectFields, type LeanUserSchemaFields, User} from "@/domains/users";
import type {RequestPaginationOptions} from "@/shared/_feat/fetch-request-options";
import createHttpError from "http-errors";
import {Reservation, type ReservationSchemaFields} from "@/domains/reservations";
import type {
    CustomerReservationQueryFilters,
    CustomerReservationQuerySorts
} from "@/domains/customer/_feat/customer-details/schema";

/** Configuration for fetching customer reservation view data. */
export type FetchCustomerReservationsViewDataConfig = {
    userId: Types.ObjectId;
    pagination: RequestPaginationOptions;
    filters?: CustomerReservationQueryFilters;
    sorts?: CustomerReservationQuerySorts;
}

/** The composite data returned for the customer reservations view. */
export type FetchCustomerReservationsViewData = {
    customer: LeanUserSchemaFields
    reservations: PaginationReturns<ReservationSchemaFields>
}

/** Fetches a customer and their paginated reservations for the details view. */
export async function fetchCustomerReservationsViewData(
    {userId, filters, sorts, pagination: {page, perPage}}: FetchCustomerReservationsViewDataConfig
): Promise<FetchCustomerReservationsViewData> {
    const customer = await User
        .findById(userId)
        .select(LeanUserQuerySelectFields)
        .lean();

    if (!customer) {
        throw createHttpError(404, "Customer Not Found.");
    }

    const [totalItems, items] = await Promise.all([
        Reservation.countDocuments({...filters, user: customer._id}),
        Reservation
            .find({...filters, user: customer._id})
            .sort({dateReserved: 1, ...sorts})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate({path: "user", select: LeanUserQuerySelectFields})
            .lean(),
    ]);

    return {
        customer,
        reservations: {
            totalItems,
            items
        },
    }
}