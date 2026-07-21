/**
 * @fileoverview Defines the constant array of valid seat status values for seat maps.
 */

/** List of valid status strings for a seat in a seat map. */
export const SeatMapStatusConstant = [
    "UNAVAILABLE",
    "AVAILABLE",
    "RESERVED",
    "PENDING",
    "SOLD",
] as const;
