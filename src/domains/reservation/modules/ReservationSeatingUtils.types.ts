/**
 * @file ReservationSeatingUtils.types.ts
 *
 * Type definitions for seating capacity checks in
 * ticket-based reservation workflows.
 */

import {Types} from "mongoose";

/**
 * Parameters required to validate seating capacity
 * for a ticket-based reservation request.
 *
 * Used for capacity-based seating (non-reserved),
 * where availability is determined by total seat count
 * rather than explicit seat selection.
 */
export type CheckSeatsForTicketParams = {
    /** Number of tickets being requested. */
    ticketCount: number;

    /** Showing for which capacity is being evaluated. */
    showingID: Types.ObjectId;

    /** Screen associated with the showing. */
    screenID: Types.ObjectId;
};
