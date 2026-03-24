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
import Showing from "../../../showing/models/showing/Showing.model.js";
import generateSlug from "../../../../shared/utility/generateSlug.js";
import type {MovieSchemaFields} from "../../../movie/model/Movie.types.js";
import {generateNanoID} from "../../../../shared/utility/generateNanoID.js";

/**
 * Mapping of reservation statuses to their mandatory audit timestamp fields.
 * * Ensures that terminal or transitional states have the matching date recorded for audit trails.
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
 * Internal validator for enforcing temporal business rules.
 * * **Status Consistency:** Checks that the status matches its corresponding date field.
 * * **Expiry Window:** Ensures `expiresAt` is set to a future timestamp for new or updated reservations.
 */
function validateDates(
    doc: HydratedDocument<ReservationSchemaFields>,
): void {
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
function validateByType(
    doc: HydratedDocument<ReservationSchemaFields>,
): void {
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
async function validateShowingSlug(
    doc: HydratedDocument<ReservationSchemaFields>,
): Promise<void> {
    const showing = await Showing
        .findById(doc.showing)
        .select("movie")
        .populate("movie")
        .lean();

    if (!showing) {
        doc.invalidate("showing", "The referenced showing does not exist.");
        return;
    }

    doc.slug = generateSlug(
        (showing.movie as unknown as MovieSchemaFields).title,
    );
}

/**
 * Generates a human-readable, unique alphanumeric verification code for the reservation.
 * * * **Format:** `RES-XXXXX-XXXXX`
 * * **Utility:** Uses two 5-character NanoID segments for a balance of brevity and collision resistance.
 */
function validateUniqueCode(
    doc: HydratedDocument<ReservationSchemaFields>,
): void {
    const nID = generateNanoID({length: 5});
    const codeString = `res-${nID()}-${nID()}`;

    doc.uniqueCode = codeString.toUpperCase();
}

/**
 * Pre-validation hook: Orchestrates all document-level business logic.
 * ---
 * 1. **Relational Sync:** Generates a slug based on the associated movie.
 * 2. **Integrity:** Validates dates and seating types.
 * 3. **Identity:** Generates a unique verification code.
 * 4. **Snapshotting:** Creates an immutable point-in-time record of the showing for new reservations.
 */
ReservationSchema.pre(
    "validate",
    async function (this: HydratedDocument<ReservationSchemaFields>, next: () => void) {
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
 * ---
 * * **Inventory Control:** Automatically locks the physical seats once the
 * reservation record is successfully created.
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