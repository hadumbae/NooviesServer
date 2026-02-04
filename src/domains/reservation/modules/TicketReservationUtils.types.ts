/**
 * @file TicketReservationUtils.types.ts
 *
 * Shared type definitions for reservation checkout orchestration.
 */

import {Types} from "mongoose";
import type {ReserveTicketSubmitData} from "../schemas/reserve-ticket/ReserveTicket.submit.schema.js";
import type {ReserveTicketInputData} from "../schemas/reserve-ticket/ReserveTicket.input.schema.js";

/**
 * Parameters required to initiate a checkout reservation.
 *
 * Represents a validated checkout submission combined
 * with the authenticated user context.
 */
export type ReserveTicketsParams = {
    /** User initiating the reservation. */
    userID: Types.ObjectId;

    /** Validated checkout submission payload. */
    data: ReserveTicketSubmitData;
};

/**
 * Checkout input narrowed to general admission reservations.
 */
export type ReserveGeneralTicketData =
    Extract<ReserveTicketInputData, {reservationType: "GENERAL_ADMISSION"}>;

/**
 * Checkout input narrowed to reserved seating reservations.
 */
export type ReserveSeatTicketData =
    Extract<ReserveTicketInputData, {reservationType: "RESERVED_SEATS"}>;
