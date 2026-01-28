import {type HydratedDocument, Schema} from "mongoose";
import type {ReservationSchemaFields} from "../../model/reservation/Reservation.types.js";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";
import {DateTime} from "luxon";

/**
 * Mapping of reservation status → required lifecycle timestamp.
 *
 * Ensures each lifecycle state is persisted with
 * its corresponding date field.
 */
const REQUIRED_DATES_BY_STATUS: Partial<Record<ReservationStatus, keyof ReservationSchemaFields>> = {
    PAID: "datePaid",
    CANCELLED: "dateCancelled",
    REFUNDED: "dateRefunded",
    EXPIRED: "dateExpired",
} as const;

/**
 * Reservation lifecycle validation service.
 *
 * Enforces schema-level lifecycle invariants:
 * - Required timestamps per reservation status
 * - Future-dated expiration for reserved reservations
 * - Seating constraints based on reservation type
 *
 * Intended for registration as document middleware.
 */
export class ReservationLifecycleService {

    /**
     * Pre-validation hook enforcing reservation lifecycle invariants.
     *
     * @this Hydrated reservation document
     * @param next Mongoose middleware continuation
     */
    private handlePreValidate(
        this: HydratedDocument<ReservationSchemaFields>,
        next: () => void,
    ) {
        // --- STATUS TIMESTAMPS ---
        const requiredDate = REQUIRED_DATES_BY_STATUS[this.status];

        if (requiredDate && !this[requiredDate]) {
            this.invalidate(requiredDate, `Required for reservations of ${this.status} status.`);
        }

        // --- RESERVED EXPIRATION ---
        if (this.status === "RESERVED") {
            if (this.isNew || this.isModified("expiresAt")) {
                const now = DateTime.utc();
                const expiresAt = DateTime.fromJSDate(this.expiresAt).toUTC().endOf("day");
                if (!(expiresAt > now)) this.invalidate("expiresAt", "Must be a later date than now.");
            }
        }

        // --- RESERVED SEATING ---
        if (this.type === "RESERVED_SEATS") {
            if (!Array.isArray(this.selectedSeating)) {
                this.invalidate("selectedSeating", "Required for reserved seating.");
            } else if (this.selectedSeating.length === 0) {
                this.invalidate("selectedSeating", "Must be a non-empty array.");
            }
        }

        // --- GENERAL ADMISSION ---
        if (this.type === "GENERAL_ADMISSION" && Array.isArray(this.selectedSeating)) {
            this.invalidate("selectedSeating", "Must not be present for general admission.");
        }

        next();
    }

    /**
     * Registers lifecycle validation middleware on a reservation schema.
     *
     * @param schema Target Mongoose schema
     */
    public registerHooks(schema: Schema) {
        schema.pre("validate", {document: true}, this.handlePreValidate);
    }
}
