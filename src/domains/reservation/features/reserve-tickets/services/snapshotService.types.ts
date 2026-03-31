/**
 * @file Parameter types for the reservation snapshot generation service.
 * @filename snapshotService.types.ts
 */

import {Types} from "mongoose";
import type {ReservationType} from "@domains/reservation/validation/enums";

/**
 * Input parameters required to generate a historically accurate showing snapshot.
 */
export type CreateReservedShowingSnapshotParams = {
    /**
     * The final total price calculated for the reservation.
     * ---
     * **Constraint:** This is saved as the "Price at Purchase" and is never
     * recalculated once the snapshot is stored.
     */
    pricePaid: number;

    /**
     * The quantity of tickets requested.
     */
    ticketCount: number;

    /**
     * Discriminator for booking logic (GA vs Reserved).
     * Impacts how `selectedSeating` is handled in the final snapshot.
     */
    reservationType: ReservationType;

    /** The MongoDB ObjectId of the source showing. */
    showingID: Types.ObjectId;

    /**
     * Optional array of seat IDs for 'RESERVED_SEATS' bookings.
     * These will be transformed into immutable seat snapshots.
     */
    selectedSeating?: Types.ObjectId[] | null | undefined;
};