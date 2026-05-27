/**
 * @file Service-level type definitions for fetching user-specific reservation history.
 * @filename service.types.ts
 */

import {Types} from "mongoose";
import type {QueryPaginationParams} from "@shared/schema/query/QueryPaginationParamsSchema";

/**
 * Configuration parameters for retrieving a paginated collection of
 * reservations for the client-side profile view.
 */
export type FetchPaginatedUserReservationsParams = {
    /** The MongoDB ObjectId of the user whose reservation history is being requested. */
    userID: Types.ObjectId;

    /** * Controls the slice of data returned.
     * Includes `page` (current index) and `perPage` (batch size).
     */
    pagination: QueryPaginationParams;
};