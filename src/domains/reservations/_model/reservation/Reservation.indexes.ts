/**
 * @fileoverview Defines MongoDB indexes for the Reservation schema to optimize queries and enforce seat exclusivity.
 */

import {ReservationSchema} from "./Reservation.schema.js";

/** Index for querying a specific user's reservations for a showing. */
ReservationSchema.index({ showing: 1, user: 1 });

/** Index for retrieving a user's reservation history sorted by date. */
ReservationSchema.index({ user: 1, dateReserved: -1 });

/** Index for managing TTL and cleanup of pending or expired reservations. */
ReservationSchema.index({ status: 1, expiresAt: 1 });

/** Unique index to prevent double-booking of seats for active reservations. */
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
