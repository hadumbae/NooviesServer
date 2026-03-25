/**
 * @file Mongoose lifecycle middleware and query hooks for the Reservation model.
 * @filename Reservation.hooks.ts
 */

import ReservationSchema from "./Reservation.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ReservationSchemaFields, ReservationDoc} from "./Reservation.types.js";
import {DateTime} from "luxon";
import {createReservedShowingSnapshot} from "../../utilities/snapshots/createReservedShowingSnapshot.js";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";
import {reserveSeatsByReservation} from "../../modules/ReservationSeatingUtils.js";
import {
    generateReservationSlug,
    generateReservationUniqueCode
} from "../../features/generate-reservation-code/index.js";

/**
 * Mapping of reservation statuses to their mandatory audit timestamp fields.
 * * Ensures that terminal or transitional states have the matching date recorded for audit trails.
 */
const REQUIRED_DATES_BY_STATUS: Partial<Record<ReservationStatus, keyof ReservationSchemaFields>> = {
    PAID: "datePaid",
    CANCELLED: "dateCancelled",
    REFUNDED: "dateRefunded",
    EXPIRED: "dateExpired",
} as const;

/**
 * Internal validator for enforcing temporal business rules.
 */
function validateDates(doc: HydratedDocument<ReservationSchemaFields>): void {
    const requiredDate = REQUIRED_DATES_BY_STATUS[doc.status];

    if (requiredDate && !doc[requiredDate]) {
        doc.invalidate(requiredDate, `Required for reservations with status "${doc.status}".`);
    }

    if (doc.status === "RESERVED" && (doc.isNew || doc.isModified("expiresAt"))) {
        const now = DateTime.utc();
        const expiresAt = DateTime.fromJSDate(doc.expiresAt).toUTC();

        if (!(expiresAt > now)) {
            doc.invalidate("expiresAt", "Must be a future date for reserved reservations.");
        }
    }
}

/**
 * Validates seating requirements based on the chosen reservation type.
 * * **RESERVED_SEATS:** Strictly requires a non-empty array of seat identifiers.
 * * **GENERAL_ADMISSION:** Explicitly forbids the presence of a seating array.
 */
function validateByType(doc: HydratedDocument<ReservationSchemaFields>): void {
    if (doc.reservationType === "RESERVED_SEATS") {
        if (!Array.isArray(doc.selectedSeating) || doc.selectedSeating.length === 0) {
            doc.invalidate(
                "selectedSeating",
                "Specific seat selections are required for this reservation type.",
            );
        }
    }

    if (doc.reservationType === "GENERAL_ADMISSION" && doc.selectedSeating?.length) {
        doc.invalidate(
            "selectedSeating",
            "Seat selections cannot be provided for general admission bookings.",
        );
    }
}

/**
 * Synchronizes the reservation slug with the associated movie's current title.
 * * Loads the related `Showing` and `Movie` to generate a human-readable URL identifier.
 */
async function validateShowingSlug(doc: HydratedDocument<ReservationSchemaFields>): Promise<void> {
    const slug = await generateReservationSlug(doc.showing);

    if (!slug) {
        doc.invalidate("slug", "Failed to generate slug. Please use a valid `showing`.");
        return;
    }

    doc.slug = slug;
}

/**
 * Generates a human-readable, unique alphanumeric verification code for the reservation.
 * * **Format:** `RES-XXXXX-XXXXX`
 */
function validateUniqueCode(doc: HydratedDocument<ReservationSchemaFields>): void {
    doc.uniqueCode = generateReservationUniqueCode();
}

/**
 * Pre-validation hook: Orchestrates all document-level business logic.
 */
ReservationSchema.pre("validate", async function (this: HydratedDocument<ReservationSchemaFields>, next: () => void) {
        if (this.isModified("showing")) {
            await validateShowingSlug(this);
        }

        validateDates(this);
        validateByType(this);
        validateUniqueCode(this);

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
 * Post-save hook: Triggers external side-effects after successful persistence.
 */
ReservationSchema.post("save", async function (this: HydratedDocument<ReservationDoc>) {
    if (this.isNew) {
        await reserveSeatsByReservation(this);
    }
});

/**
 * Pre-find hook: Enforces soft-deletion filtering globally for all read queries.
 */
ReservationSchema.pre("find", {query: true}, async function (next: () => void) {
    if (this.getOptions().getSoftDeleted) {
        return next();
    }

    this.where({isDeleted: false, deletedAt: null});
    return next();
});