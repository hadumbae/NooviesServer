/**
 * @file SeatSnapshotSchemaFields.ts
 *
 * @summary
 * Snapshot field definitions for a cinema seat.
 *
 * @description
 * Represents the immutable state of a seat at a specific moment in time.
 * Commonly embedded within screen, showing, or reservation snapshots to
 * preserve historical accuracy even if the base seat definition changes.
 */

import type {SeatType} from "../../schema/enum/SeatTypeEnum.js";

/**
 * Immutable snapshot of a seat’s state.
 */
export interface SeatSnapshotSchemaFields {
    /** Unique seat identifier (e.g. "A1"). */
    seatName: string;

    /** Classification of the seat (e.g. Regular, VIP). */
    seatType: SeatType;

    /** Optional human-friendly label for display purposes. */
    seatLabel?: string;

    /**
     * Price multiplier applied to the base ticket price.
     *
     * @example
     * 1.0   // standard pricing
     * 1.25  // premium seat
     * 0.8   // discounted seat
     */
    priceMultiplier: number;

    /** Horizontal position of the seat in the screen layout grid. */
    x: number;

    /** Vertical position of the seat in the screen layout grid. */
    y: number;
}
