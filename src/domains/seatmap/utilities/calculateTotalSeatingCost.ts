import type {SeatMapSchemaFields, SeatMapWithSeat} from "../model/SeatMap.types.js";

/**
 * Calculates the total price for a set of reserved seats.
 *
 * For each seat-map entry, the effective price is resolved using:
 * - `overridePrice` when present
 * - otherwise `basePrice × priceMultiplier`
 *
 * @remarks
 * - Input is assumed to be validated and populated upstream
 * - This utility performs no rounding or currency normalization
 *
 * @param seating - Seat-map entries to price
 * @returns Total seating cost
 */
export function calculateTotalSeatingCost(seating: (SeatMapSchemaFields | SeatMapWithSeat)[]): number {
    return seating
        .map(({overridePrice, basePrice, priceMultiplier}) => overridePrice ?? basePrice * priceMultiplier)
        .reduce((acc, cur) => acc + cur, 0);
}
