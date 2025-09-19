import {Types} from "mongoose";
import type {SeatType} from "../schema/enum/SeatTypeEnum.js";

/**
 * Interface representing a seat with its associated screen and theatre.
 * Extends the base seat properties from ISeatBase.
 */
export default interface ISeat {
    /**
     * The unique MongoDB ObjectId of the seat.
     */
    readonly _id: Types.ObjectId;

    /**
     * The ObjectId of the screen this seat belongs to.
     */
    screen: Types.ObjectId;

    /**
     * The ObjectId of the theatre this seat belongs to.
     */
    theatre: Types.ObjectId;

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
     * X coordinate for seat layout positioning.
     */
    x: number;

    /**
     * Y coordinate for seat layout positioning.
     */
    y: number;
}