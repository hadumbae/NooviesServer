/**
 * @file Reservation.hooks.ts
 *
 * Mongoose lifecycle middleware for the Reservation model.
 *
 * Responsibilities:
 * - Enforce lifecycle timestamp invariants
 * - Validate reservation-type seating constraints
 * - Maintain showing → movie slug consistency
 * - Create immutable reservation snapshot at creation
 * - Trigger seat locking after persistence
 *
 * @remarks
 * This module augments the Reservation schema via middleware.
 * All logic runs automatically during the Mongoose lifecycle.
 */

import ReservationSchema from "./Reservation.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ReservationSchemaFields, ReservationDoc} from "./Reservation.types.js";
import {DateTime} from "luxon";
import {createReservedShowingSnapshot} from "../../utilities/snapshots/createReservedShowingSnapshot.js";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";
import {reserveSeatsByReservation} from "../../modules/ReservationSeatingUtils.js";
import Showing from "../../../showing/model/showing/Showing.model.js";
import generateSlug from "../../../../shared/utility/generateSlug.js";
import type {MovieSchemaFields} from "../../../movie/model/Movie.types.js";

/**
 * Maps reservation statuses to their required lifecycle timestamp field.
 *
 * @remarks
 * Ensures terminal and paid states persist their corresponding date field.
 *
 * Example:
 * - PAID → datePaid
 * - CANCELLED → dateCancelled
 */
const REQUIRED_DATES_BY_STATUS: Partial<
    Record<ReservationStatus, keyof ReservationSchemaFields>
> = {
    PAID: "datePaid",
    CANCELLED: "dateCancelled",
    REFUNDED: "dateRefunded",
    EXPIRED: "dateExpired",
} as const;

/**
 * Validates lifecycle timestamp rules.
 *
 * Enforces:
 * - Required timestamps for terminal and paid statuses
 * - Future-dated expiration for `RESERVED` reservations
 *
 * @param doc - Hydrated reservation document
 *
 * @remarks
 * Uses Luxon in UTC to prevent timezone inconsistencies.
 */
function validateDates(
    doc: HydratedDocument<ReservationSchemaFields>,
): void {
    const requiredDate = REQUIRED_DATES_BY_STATUS[doc.status];

    if (requiredDate && !doc[requiredDate]) {
        doc.invalidate(
            requiredDate,
            `Required for reservations with status "${doc.status}".`,
        );
    }

    if (doc.status === "RESERVED") {
        if (doc.isNew || doc.isModified("expiresAt")) {
            const now = DateTime.utc();
            const expiresAt = DateTime
                .fromJSDate(doc.expiresAt)
                .toUTC()
                .endOf("day");

            if (!(expiresAt > now)) {
                doc.invalidate(
                    "expiresAt",
                    "Must be a future date for reserved reservations.",
                );
            }
        }
    }
}

/**
 * Validates seating constraints based on reservation type.
 *
 * Rules:
 * - `RESERVED_SEATS` requires a non-empty `selectedSeating` array
 * - `GENERAL_ADMISSION` must not contain seating selections
 *
 * @param doc - Hydrated reservation document
 */
function validateByType(
    doc: HydratedDocument<ReservationSchemaFields>,
): void {
    if (doc.reservationType === "RESERVED_SEATS") {
        if (!Array.isArray(doc.selectedSeating)) {
            doc.invalidate(
                "selectedSeating",
                "Required for reserved seating reservations.",
            );
        } else if (doc.selectedSeating.length === 0) {
            doc.invalidate(
                "selectedSeating",
                "Must contain at least one seat.",
            );
        }
    }

    if (
        doc.reservationType === "GENERAL_ADMISSION" &&
        Array.isArray(doc.selectedSeating)
    ) {
        doc.invalidate(
            "selectedSeating",
            "Must not be present for general admission.",
        );
    }
}

/**
 * Ensures reservation slug matches the associated movie title.
 *
 * - Loads the showing
 * - Populates its movie
 * - Generates a slug from the movie title
 *
 * @param doc - Hydrated reservation document
 *
 * @remarks
 * Runs only when the `showing` field is modified.
 */
async function validateShowingSlug(
    doc: HydratedDocument<ReservationSchemaFields>,
): Promise<void> {
    const showing = await Showing
        .findById(doc.showing)
        .select("movie")
        .populate("movie")
        .lean();

    if (!showing) {
        doc.invalidate("showing", "Invalid showing.");
        return;
    }

    doc.slug = generateSlug(
        (showing.movie as MovieSchemaFields).title,
    );
}

/**
 * Pre-validation middleware.
 *
 * Executes:
 * - Showing slug validation (if modified)
 * - Lifecycle date validation
 * - Reservation-type seating validation
 * - Immutable snapshot creation (creation only)
 *
 * @remarks
 * Snapshot is generated once during initial reservation creation
 * and remains immutable thereafter.
 */
ReservationSchema.pre(
    "validate",
    async function (this: HydratedDocument<ReservationSchemaFields>, next: () => void) {
        if (this.isModified("showing")) {
            await validateShowingSlug(this);
        }

        validateDates(this);
        validateByType(this);

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

/**
 * Post-save middleware.
 *
 * Locks seats for newly created reservations.
 *
 * @remarks
 * Executed only when the document is first persisted.
 * Seat locking occurs after successful save to preserve data integrity.
 */
ReservationSchema.post("save", async function (this: HydratedDocument<ReservationDoc>) {
    if (this.isNew) {
        await reserveSeatsByReservation(this);
    }
});
