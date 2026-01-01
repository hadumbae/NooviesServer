import { Types } from "mongoose";
import type { SeatType } from "../schema/enum/SeatTypeEnum.js";
import type { SeatLayoutType } from "../schema/enum/SeatLayoutTypeEnum.js";

/**
 * @summary
 * Interface representing a single seat within a cinema screen.
 *
 * @description
 * Defines positional, relational, and pricing metadata for a seat,
 * including layout coordinates, seat classification, availability,
 * and theatre/screen ownership.
 *
 * Coordinates (`x`, `y`) correspond to the seat’s position
 * within the screen layout grid.
 *
 * @example
 * ```ts
 * const seat: ISeat = {
 *   _id: new Types.ObjectId(),
 *   theatre: new Types.ObjectId(),
 *   screen: new Types.ObjectId(),
 *   row: "A",
 *   seatNumber: 1,
 *   seatLabel: "VIP-1",
 *   seatType: "VIP",
 *   layoutType: "Seat",
 *   isAvailable: true,
 *   priceMultiplier: 1.5,
 *   x: 1,
 *   y: 1,
 *   slug: "a-1",
 * };
 * ```
 */
export interface SeatSchemaFields {
    /**
     * Unique MongoDB identifier for the seat.
     */
    readonly _id: Types.ObjectId;

    /**
     * Screen this seat belongs to.
     */
    screen: Types.ObjectId;

    /**
     * Theatre this seat belongs to.
     */
    theatre: Types.ObjectId;

    /**
     * Row identifier for the seat (e.g., "A", "B").
     */
    row: string;

    /**
     * Numeric position of the seat within the row.
     */
    seatNumber: number;

    /**
     * Optional human-friendly seat label.
     *
     * @example "A5"
     * @example "VIP-1"
     */
    seatLabel?: string;

    /**
     * Classification of the seat.
     */
    seatType: SeatType;

    /**
     * Layout role of the seat within the screen grid.
     *
     * @example "Seat"
     * @example "Aisle"
     * @example "Stair"
     */
    layoutType: SeatLayoutType;

    /**
     * Indicates whether the seat can currently be booked.
     */
    isAvailable: boolean;

    /**
     * Multiplier applied to the base ticket price.
     */
    priceMultiplier: number;

    /**
     * Horizontal position in the seat layout grid.
     */
    x: number;

    /**
     * Vertical position in the seat layout grid.
     */
    y: number;

    /**
     * URL-safe unique identifier for the seat.
     */
    slug: string;
}
