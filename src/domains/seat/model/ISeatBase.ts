import {Types} from "mongoose";
import type {SeatType} from "../schema/enum/SeatTypeEnum.js";

/**
 * Base interface representing a seat's core properties.
 */
export default interface ISeatBase {
    /**
     * The unique MongoDB ObjectId of the seat.
     */
    readonly _id: Types.ObjectId;

    /**
     * The row label the seat belongs to (e.g., "A", "B").
     */
    row: string;

    /**
     * The seat number within the row.
     */
    seatNumber: number;

    /**
     * Optional label for the seat, often used for display (e.g., "A5", "VIP-1").
     */
    seatLabel?: string;

    /**
     * The type/category of the seat (e.g., standard, VIP, couple).
     */
    seatType: SeatType;

    /**
     * Whether the seat is currently available for booking.
     */
    isAvailable: boolean;

    /**
     * Price multiplier applied to the base ticket price for this seat.
     */
    priceMultiplier: number;

    /**
     * Optional X coordinate for seat layout positioning.
     */
    x?: number;

    /**
     * Optional Y coordinate for seat layout positioning.
     */
    y?: number;
}