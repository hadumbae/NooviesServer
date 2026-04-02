/**
 * @file Mongoose lifecycle middleware and query hooks for the Reservation model.
 * @filename Reservation.hooks.ts
 */

import ReservationSchema from "./Reservation.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ReservationSchemaFields, ReservationDoc} from "./Reservation.types.js";
import {DateTime} from "luxon";
import {
    generateReservationUniqueCode
} from "../../features/generate-reservation-code/index.js";
import {
    createReservedShowingSnapshot,
    reserveReservationSeats
} from "@domains/reservation/features/reserve-tickets/services";
import type {ReservationStatus} from "@domains/reservation/validation/enums";
import SeatMap from "@domains/seatmap/model/SeatMap.model";
import generateSlug from "@shared/utility/generateSlug";
import type {PopulatedShowing} from "@domains/showing/models/showing/Showing.types";

/**
 * Mapping of reservation statuses to their mandatory audit timestamp fields.
 * Ensures that terminal or transitional states have the matching date recorded for audit trails.
 */
const REQUIRED_DATES_BY_STATUS: Partial<Record<ReservationStatus, keyof ReservationSchemaFields>> = {
    PAID: "datePaid",
    CANCELLED: "dateCancelled",
    REFUNDED: "dateRefunded",
    EXPIRED: "dateExpired",
} as const;

/**
 * Pre-validation hook: Orchestrates all document-level business logic and field initialization.
 */
ReservationSchema.pre("validate", async function (this: HydratedDocument<ReservationSchemaFields>, next: () => void) {
    // --- Is New ? ---

    if (this.isNew) {
        this.uniqueCode = generateReservationUniqueCode();

        this.snapshot = await createReservedShowingSnapshot({
            reservationType: this.reservationType,
            ticketCount: this.ticketCount,
            pricePaid: this.pricePaid,
            selectedSeating: this.selectedSeating,
            showingID: this.showing,
        });

        await this.populate({path: "showing", populate: {path: "movie"}});

        if (!this.showing) {
            this.invalidate("slug", "Failed to generate slug. Please use a valid `showing`.");
        } else {
            this.slug = generateSlug((this.showing as unknown as PopulatedShowing).movie.title);
        }
    }

    // --- Validate Dates ---

    const requiredDate = REQUIRED_DATES_BY_STATUS[this.status];

    if (requiredDate && !this[requiredDate]) {
        this.invalidate(requiredDate, `Required for reservations with status "${this.status}".`);
    }

    if (this.status === "RESERVED" && (this.isNew || this.isModified("expiresAt"))) {
        const now = DateTime.utc();
        const expiresAt = DateTime.fromJSDate(this.expiresAt).toUTC();

        if (!(expiresAt > now)) {
            this.invalidate("expiresAt", "Must be a future date for reserved reservations.");
        }
    }

    // --- Validate Types ---

    if (this.reservationType === "RESERVED_SEATS") {
        if (!Array.isArray(this.selectedSeating) || this.selectedSeating.length === 0) {
            this.invalidate(
                "selectedSeating",
                "Specific seat selections are required for this reservation type.",
            );
        }
    }

    if (this.reservationType === "GENERAL_ADMISSION" && this.selectedSeating?.length) {
        this.invalidate(
            "selectedSeating",
            "Seat selections cannot be provided for general admission bookings.",
        );
    }

    next();
});

/**
 * Post-save hook: Triggers external side-effects after successful persistence.
 */
ReservationSchema.post("save", async function (this: HydratedDocument<ReservationDoc>) {
    if (this.isNew) {
        await reserveReservationSeats(this);
    }

    if (this.status !== "RESERVED" && this.status !== "PAID") {
        await SeatMap.updateMany(
            {reservation: this._id},
            {reservation: null, status: "AVAILABLE"},
        );
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