/**
 * @file TicketReservationUtils.types.ts
 *
 * Type definitions for reservation checkout flows.
 */

import { Types } from "mongoose";
import type { ReserveTicketSubmitData } from "../../schemas/reserve-ticket/ReserveTicket.submit.schema.js";
import type { ReserveTicketInputData } from "../../schemas/reserve-ticket/ReserveTicket.input.schema.js";

/**
 * Parameters for creating a reservation.
 *
 * Combines authenticated user context with
 * a validated checkout submission.
 */
export type ReserveTicketsParams = {
    /** Authenticated user identifier. */
    userID: Types.ObjectId;

    /** Validated reservation submission payload. */
    data: ReserveTicketSubmitData;
};

/**
 * Checkout input restricted to general admission.
 */
export type ReserveGeneralTicketData =
    Extract<ReserveTicketInputData, { reservationType: "GENERAL_ADMISSION" }>;

/**
 * Checkout input restricted to reserved seating.
 */
export type ReserveSeatTicketData =
    Extract<ReserveTicketInputData, { reservationType: "RESERVED_SEATS" }>;
