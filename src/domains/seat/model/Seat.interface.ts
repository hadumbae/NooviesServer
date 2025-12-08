import { Types } from "mongoose";
import type { SeatType } from "../schema/enum/SeatTypeEnum.js";
import type { SeatLayoutType } from "../schema/enum/SeatLayoutTypeEnum.js";

/**
 * ## ISeat
 *
 * Interface representing a single seat within a theatre screen.
 * Includes references to its theatre and screen, position coordinates,
 * type, layout, availability, and pricing information.
 *
 * @remarks
 * - Extends the base seat properties defined elsewhere (if any).
 * - Coordinates (`x`, `y`) correspond to the seat's location in the screen layout grid.
 * - `seatType` and `layoutType` are strongly typed based on the corresponding enums.
 *
 * @example
 * ```ts
 * import type ISeat from "@/pages/seat/model/Seat.interface.ts";
 *
 * const seat: ISeat = {
 *   _id: new Types.ObjectId(),
 *   theatre: new Types.ObjectId("64f1c0c8ab1234567890abcd"),
 *   screen: new Types.ObjectId("64f1c0c8ab1234567890abce"),
 *   row: "A",
 *   seatNumber: 1,
 *   seatLabel: "VIP-1",
 *   seatType: "VIP",
 *   layoutType: "Seat",
 *   isAvailable: true,
 *   priceMultiplier: 1.5,
 *   x: 1,
 *   y: 1,
 * };
 * ```
 */
export default interface ISeat {
    /** The unique MongoDB ObjectId of the seat. */
    readonly _id: Types.ObjectId;

    /** The ObjectId of the screen this seat belongs to. */
    screen: Types.ObjectId;

    /** The ObjectId of the theatre this seat belongs to. */
    theatre: Types.ObjectId;

    /** The row label the seat belongs to (e.g., "A", "B"). */
    row: string;

    /** The seat number within the row. */
    seatNumber: number;

    /** Optional label for the seat, often used for display (e.g., "A5", "VIP-1"). */
    seatLabel?: string;

    /** The type/category of the seat (e.g., standard, VIP, couple). */
    seatType: SeatType;

    /** Layout type of the seat (e.g., "Seat", "Aisle", "Stair"). */
    layoutType: SeatLayoutType;

    /** Whether the seat is currently available for booking. */
    isAvailable: boolean;

    /** Price multiplier applied to the base ticket price for this seat. */
    priceMultiplier: number;

    /** X coordinate for seat layout positioning in the screen grid. */
    x: number;

    /** Y coordinate for seat layout positioning in the screen grid. */
    y: number;
}
