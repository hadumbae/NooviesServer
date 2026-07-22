/**
 * @fileoverview Defines the valid lifecycle states for a movie showing.
 */

/** List of constant status strings for showings. */
export const ShowingStatusConstant = [
    "SCHEDULED",
    "RUNNING",
    "COMPLETED",
    "CANCELLED",
    "SOLD_OUT"
] as const;
