import type {SeatType} from "../enum/SeatTypeEnum.js";

/**
 * Base interface for seat submission data.
 * Represents the core information needed to associate a seat with a screen and theatre.
 */
export default interface ISeatSubmitBase {
    /**
     * The type or category of the seat (e.g., standard, VIP, couple).
     */
    seatType: SeatType;

    /**
     * Indicates whether the seat is available for booking.
     */
    isAvailable: boolean;

    /**
     * A multiplier applied to the base ticket price for this seat.
     */
    priceMultiplier: number;

    /**
     * The ID of the theatre this seat belongs to.
     */
    theatre: string;

    /**
     * The ID of the screen this seat belongs to.
     */
    screen: string;
}