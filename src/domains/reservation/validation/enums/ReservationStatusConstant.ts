/**
 * @fileoverview Immutable list of supported reservation status codes.
 */

/** Supported lifecycle states for a reservation. */
export const ReservationStatusConstant = [
    "RESERVED",
    "PAID",
    "CANCELLED",
    "REFUNDED",
    "EXPIRED",
    "INVALID",
] as const;