import type ISeatSubmitBase from "./ISeatSubmitBase.js";

/**
 * Interface representing a submission payload for creating multiple seats in a single row.
 * Extends {@link ISeatSubmitBase} with row information and seat count.
 */
export default interface ISeatsByRowSubmit extends ISeatSubmitBase {
    /**
     * The row label where the seats will be added (e.g., "A", "B").
     */
    row: string;

    /**
     * Optional Y coordinate for seat layout positioning.
     */
    y?: number;

    /**
     * The total number of seats to create in the specified row.
     */
    numberOfSeats: number;
}