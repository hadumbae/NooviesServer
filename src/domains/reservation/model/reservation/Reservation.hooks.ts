/**
 * @file Reservation.hooks.ts
 *
 * Schema-level lifecycle hooks for the Reservation model.
 *
 * Enforces reservation invariants related to:
 * - lifecycle status and required timestamps
 * - expiration rules for unpaid reservations
 * - seating constraints based on reservation type
 * - immutable snapshot creation at reservation time
 *
 * These hooks are intended to run automatically as part of
 * the Reservation schema middleware pipeline.
 */

import ReservationSchema from "./Reservation.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ReservationSchemaFields} from "./Reservation.types.js";
import {DateTime} from "luxon";
import {createReservedShowingSnapshot} from "../../utilities/snapshots/createReservedShowingSnapshot.js";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";

/**
 * Mapping of reservation status to its required lifecycle timestamp field.
 *
 * @remarks
 * Used to ensure that each terminal or paid reservation state
 * persists its corresponding date field.
 */
const REQUIRED_DATES_BY_STATUS: Partial<Record<ReservationStatus, keyof ReservationSchemaFields>> = {
    PAID: "datePaid",
    CANCELLED: "dateCancelled",
    REFUNDED: "dateRefunded",
    EXPIRED: "dateExpired",
} as const;

/**
 * Validates lifecycle timestamps based on reservation status.
 *
 * Enforces:
 * - required timestamps for terminal and paid states
 * - future-dated expiration for reserved (unpaid) reservations
 *
 * @param doc Hydrated reservation document
 */
function validateDates(doc: HydratedDocument<ReservationSchemaFields>) {
    const requiredDate = REQUIRED_DATES_BY_STATUS[doc.status];

    if (requiredDate && !doc[requiredDate]) {
        doc.invalidate(requiredDate, `Required for reservations with status "${doc.status}".`);
    }

    if (doc.status === "RESERVED") {
        if (doc.isNew || doc.isModified("expiresAt")) {
            const now = DateTime.utc();
            const expiresAt = DateTime
                .fromJSDate(doc.expiresAt)
                .toUTC()
                .endOf("day");

            if (!(expiresAt > now)) {
                doc.invalidate("expiresAt", "Must be a future date for reserved reservations.");
            }
        }
    }
}

/**
 * Validates seating constraints based on reservation type.
 *
 * Enforces:
 * - required, non-empty seating for reserved seating reservations
 * - absence of seating for general admission reservations
 *
 * @param doc Hydrated reservation document
 */
function validateByType(doc: HydratedDocument<ReservationSchemaFields>) {
    if (doc.reservationType === "RESERVED_SEATS") {
        if (!Array.isArray(doc.selectedSeating)) {
            doc.invalidate("selectedSeating", "Required for reserved seating reservations.");
        } else if (doc.selectedSeating.length === 0) {
            doc.invalidate("selectedSeating", "Must contain at least one seat.");
        }
    }

    if (doc.reservationType === "GENERAL_ADMISSION" && Array.isArray(doc.selectedSeating)) {
        doc.invalidate("selectedSeating", "Must not be present for general admission.");
    }
}

/**
 * Reservation persistence hook.
 *
 * Performs lifecycle validation and derives immutable snapshot data
 * before the reservation is saved.
 *
 * @remarks
 * - Validation errors are surfaced via `invalidate`
 * - Showing snapshots are created only once, at reservation creation
 */
ReservationSchema.pre(
    "save",
    async function (this: HydratedDocument<ReservationSchemaFields>, next: () => void) {
        validateDates(this);
        validateByType(this);

        // --- SNAPSHOT CREATION ---
        if (this.isNew) {
            this.snapshot = await createReservedShowingSnapshot({
                reservationType: this.reservationType,
                ticketCount: this.ticketCount,
                pricePaid: this.pricePaid,
                selectedSeating: this.selectedSeating,
                showingID: this.showing,
            });
        }

        next();
    },
);
