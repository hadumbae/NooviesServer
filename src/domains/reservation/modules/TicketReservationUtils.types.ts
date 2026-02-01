/**
 * @file TicketReservationUtils.types.ts
 *
 * Shared type definitions for reservation checkout orchestration.
 */

import {Types} from "mongoose";
import type {TicketCheckoutSubmitData} from "../schemas/ticket-checkout/TicketCheckout.submit.schema.js";
import type {TicketCheckoutInputData} from "../schemas/ticket-checkout/TicketCheckout.input.schema.js";

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
    data: TicketCheckoutSubmitData;
};

/**
 * Checkout input narrowed to general admission reservations.
 */
export type ReserveGeneralTicketData =
    Extract<TicketCheckoutInputData, {reservationType: "GENERAL_ADMISSION"}>;

/**
 * Checkout input narrowed to reserved seating reservations.
 */
export type ReserveSeatTicketData =
    Extract<TicketCheckoutInputData, {reservationType: "RESERVED_SEATS"}>;
