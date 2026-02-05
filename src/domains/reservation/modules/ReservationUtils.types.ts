/**
 * @file ReservationUtils.types.ts
 *
 * Shared type definitions for reservation utility functions.
 */

import {Types} from "mongoose";
import type {QueryPaginationParams} from "../../../shared/schema/query/QueryPaginationParamsSchema.js";

/**
 * Parameters for fetching a user's reservations with pagination.
 */
export type FetchPaginatedUserReservationsParams = {
    /** MongoDB ObjectId of the user */
    userID: Types.ObjectId;

    /** Pagination configuration (page, perPage) */
    pagination: QueryPaginationParams;
};
