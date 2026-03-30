/**
 * @file Type definitions for the reservation orchestration service.
 * @filename service.types.ts
 */

import {Types} from "mongoose";
import type {ReserveTicketInputData} from "@domains/reservation/features/reserve-tickets/schemas/inputSchema";
import type {ReserveTicketPersistenceData} from "@domains/reservation/features/reserve-tickets/schemas";

/**
 * Parameters for the primary reservation service entry point.
 */
export type ReserveTicketsParams = {
    /** The authenticated User ID. */
    userID: Types.ObjectId;

    /** The validated client payload (GA vs Reserved). */
    inputData: ReserveTicketInputData;
};

/**
 * Persistence data constrained to General Admission logic.
 */
export type ReserveGeneralTicketData =
    Extract<ReserveTicketPersistenceData, { reservationType: "GENERAL_ADMISSION" }>;

/**
 * Persistence data constrained to Reserved Seating logic.
 */
export type ReserveSeatTicketData =
    Extract<ReserveTicketPersistenceData, { reservationType: "RESERVED_SEATS" }>;