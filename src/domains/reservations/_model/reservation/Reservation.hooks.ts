/**
 * @fileoverview Mongoose lifecycle middleware and query hooks for the Reservation model.
 */

import {ReservationSchema} from "./Reservation.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ReservationSchemaFields, ReservationDoc} from "./Reservation.types.js";
import {DateTime} from "luxon";
import {
    generateReservationUniqueCode
} from "@/domains/reservations/_feat/generate-reservation-code/index.js";
import type {ReservationStatus} from "@/domains/reservations/_validation";
import {SeatMap} from "@/domains/seatmap/_model/seat-map/SeatMap.model";
import generateSlug from "@/shared/utility/generateSlug";
import type {PopulatedShowing} from "@/domains/showing/models/showing/Showing.types";
import {createReservedShowingSnapshot, reserveReservationSeats} from "@/domains/reservations/_feat/reserve-tickets";

/**
 * Mapping of reservation statuses to their mandatory audit timestamp fields.
 */
const REQUIRED_DATES_BY_STATUS: Partial<Record<ReservationStatus, keyof ReservationSchemaFields>> = {
    PAID: "datePaid",
    CANCELLED: "dateCancelled",
    REFUNDED: "dateRefunded",
    EXPIRED: "dateExpired",
} as const;

/**
 * Orchestrates all document-level business logic and field initialization before validation.
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
 * Triggers external side-effects and seat status updates after successful persistence.
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
 * Enforces soft-deletion filtering globally for all read queries.
 */
ReservationSchema.pre("find", {query: true}, async function (next: () => void) {
    if (this.getOptions().getSoftDeleted) {
        return next();
    }

    this.where({isDeleted: false, deletedAt: null});
    return next();
});
