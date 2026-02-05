/**
 * @file Reservation.indexes.ts
 *
 * Reservation schema indexes.
 *
 * Defines query, lifecycle, and uniqueness indexes used to:
 * - optimize reservation lookup
 * - support lifecycle sweeps
 * - enforce seat-level exclusivity
 *
 * @remarks
 * General admission reservations do not allocate individual seats.
 * For `"GENERAL_ADMISSION"`:
 * - `selectedSeating` is expected to be `null` or empty
 * - seat-level uniqueness constraints are not applicable
 *
 * Seat exclusivity is therefore enforced **only** for
 * `"RESERVED_SEATS"` reservations via a partial unique index.
 */

import ReservationSchema from "./Reservation.schema.js";

/**
 * Enables efficient lookup of a user’s reservation
 * for a specific showing.
 *
 * Applicable to both general admission and reserved seating.
 */
ReservationSchema.index({showing: 1, user: 1});

/**
 * Optimizes retrieval of a user’s reservation history,
 * ordered by creation time (most recent first).
 */
ReservationSchema.index({user: 1, dateReserved: -1});

/**
 * Supports lifecycle sweeps for expiring reservations.
 *
 * Used by background jobs to locate and transition
 * expired or stale reservations.
 */
ReservationSchema.index({status: 1, expiresAt: 1});

/**
 * Enforces seat-level exclusivity for reserved seating.
 *
 * @remarks
 * This index intentionally excludes `"GENERAL_ADMISSION"` reservations:
 * - `selectedSeating` is `null` or empty for GA
 * - GA reservations are capacity-based, not seat-based
 *
 * Implemented as a partial unique index so that:
 * - only `"RESERVED_SEATS"` reservations participate
 * - only active (`"RESERVED"`) reservations block seat reuse
 * - completed or cancelled reservations do not conflict
 */
ReservationSchema.index(
    {showing: 1, selectedSeating: 1},
    {
        unique: true,
        partialFilterExpression: {
            reservationType: "RESERVED_SEATS",
            status: "RESERVED",
        },
    },
);
