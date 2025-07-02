import type ISeatSubmitBase from "./ISeatSubmitBase.js";

/**
 * Interface representing the full payload for submitting or creating a seat.
 * Extends {@link ISeatSubmitBase} with row-specific and layout-related fields.
 */
export default interface ISeatSubmit extends ISeatSubmitBase {
    /**
     * The row label the seat belongs to (e.g., "A", "B").
     */
    row: string;

    /**
     * The seat number within the row.
     */
    seatNumber: number;

    /**
     * Optional label used for display purposes (e.g., "A5", "VIP-3").
     */
    seatLabel?: string;

    /**
     * Optional horizontal coordinate for visual seat placement.
     */
    x?: number;

    /**
     * Optional vertical coordinate for visual seat placement.
     */
    y?: number;
}