/**
 * Reservation schema indexes.
 *
 * Defines query and uniqueness indexes used to optimize
 * reservation lookup, lifecycle processing, and seat locking.
 */

import ReservationSchema from "./Reservation.schema.js";

/**
 * Supports efficient lookup of a user’s reservation
 * for a specific showing.
 */
ReservationSchema.index({showing: 1, user: 1});

/**
 * Optimizes retrieval of a user’s reservation history,
 * ordered by creation time.
 */
ReservationSchema.index({user: 1, dateReserved: -1});

/**
 * Supports lifecycle sweeps for expiring reservations
 * by status and expiration timestamp.
 */
ReservationSchema.index({status: 1, expiresAt: 1});

/**
 * Ensures a seat within a showing may only be reserved once
 * while the reservation status is `"RESERVED"`.
 */
ReservationSchema.index(
    {showing: 1, selectedSeating: 1},
    {unique: true, partialFilterExpression: {status: "RESERVED"}},
);
