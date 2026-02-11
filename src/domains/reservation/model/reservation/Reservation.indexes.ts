/**
 * @file Reservation.indexes.ts
 *
 * Defines all MongoDB indexes for the Reservation schema.
 *
 * Responsibilities:
 * - Optimize common reservation queries
 * - Support lifecycle expiration sweeps
 * - Enforce seat-level exclusivity for reserved seating
 *
 * @remarks
 * Reservation types:
 *
 * - "GENERAL_ADMISSION"
 *   - Capacity-based
 *   - Does NOT allocate individual seats
 *   - `selectedSeating` is null or empty
 *
 * - "RESERVED_SEATS"
 *   - Seat-based
 *   - Requires seat-level uniqueness enforcement
 *
 * Seat exclusivity is enforced ONLY for:
 * - reservationType = "RESERVED_SEATS"
 * - status = "RESERVED"
 *
 * Cancelled, expired, or completed reservations
 * do NOT block seat reuse.
 */

import ReservationSchema from "./Reservation.schema.js";

/**
 * Efficient lookup of a user's reservation
 * for a specific showing.
 *
 * Applies to both GA and reserved seating.
 */
ReservationSchema.index({ showing: 1, user: 1 });

/**
 * Optimizes retrieval of a user's reservation history,
 * ordered by most recent first.
 */
ReservationSchema.index({ user: 1, dateReserved: -1 });

/**
 * Supports lifecycle sweeps for expiring reservations.
 *
 * Used by background jobs to:
 * - Find active reservations nearing expiration
 * - Transition stale reservations
 */
ReservationSchema.index({ status: 1, expiresAt: 1 });

/**
 * Enforces seat-level exclusivity for reserved seating.
 *
 * Unique per:
 * - showing
 * - selectedSeating
 *
 * @remarks
 * Implemented as a partial unique index so that:
 * - Only "RESERVED_SEATS" reservations participate
 * - Only active ("RESERVED") reservations block reuse
 * - GA reservations are excluded
 * - Cancelled/expired/completed reservations do not conflict
 */
ReservationSchema.index(
    { showing: 1, selectedSeating: 1 },
    {
        unique: true,
        partialFilterExpression: {
            reservationType: "RESERVED_SEATS",
            status: "RESERVED",
        },
    },
);
