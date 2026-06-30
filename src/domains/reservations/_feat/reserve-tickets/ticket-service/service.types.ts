/**
 * @fileoverview Type definitions for the reservation orchestration service.
 */

import {Types} from "mongoose";
import type {ReserveTicketInputData} from "@/domains/reservations/_feat/reserve-tickets/schemas/inputSchema";
import type {ReserveTicketPersistenceData} from "@/domains/reservations/_feat/reserve-tickets/schemas";

/** Parameters for the primary reservation service entry point. */
export type ReserveTicketsParams = {
    userID: Types.ObjectId;
    inputData: ReserveTicketInputData;
};

/** Persistence data constrained to General Admission logic. */
export type ReserveGeneralTicketData = Extract<ReserveTicketPersistenceData, { reservationType: "GENERAL_ADMISSION" }>;

/** Persistence data constrained to Reserved Seating logic. */
export type ReserveSeatTicketData = Extract<ReserveTicketPersistenceData, { reservationType: "RESERVED_SEATS" }>;