/**
 * @file ReservationStatusConstant.ts
 *
 * @description
 * Immutable list of supported reservation status codes.
 *
 * Represents the lifecycle states of a reservation from creation through
 * payment, cancellation, expiration, and refund processing.
 */

export default [
    "RESERVED",
    "PAID",
    "CANCELLED",
    "REFUNDED",
    "EXPIRED",
] as const;
