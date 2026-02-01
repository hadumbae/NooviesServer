/**
 * @file Reservation.types.ts
 *
 * Core field definitions for a reservation.
 *
 * A reservation is a transactional aggregate composed of:
 * - an immutable snapshot of the reserved showing
 * - live references to user, showing, and seating
 * - authoritative financial data
 * - lifecycle state and timestamps
 *
 * Designed to support reservation, payment, cancellation,
 * expiration, and refund workflows while preserving
 * historical accuracy.
 */

import type {ReservedShowingSnapshotSchemaFields} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.types.js";
import {Types} from "mongoose";
import type {ISO4217CurrencyCode} from "../../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";
import type {PositiveNumber} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import type {ReservationType} from "../../schemas/enum/ReservationTypeEnumSchema.js";

/**
 * Reservation schema fields.
 *
 * @remarks
 * This model follows a snapshot-first design to guarantee that
 * pricing, scheduling, language, and seating data remain
 * historically correct even if referenced entities change
 * or are removed.
 *
 * Lifecycle-dependent invariants by {@link ReservationStatus}:
 * - `"RESERVED"` → `dateReserved`, `expiresAt` (future-dated)
 * - `"PAID"` → `datePaid`
 * - `"CANCELLED"` → `dateCancelled`
 * - `"REFUNDED"` → `dateRefunded`
 * - `"EXPIRED"` → `dateExpired`
 *
 * Optional vs nullable semantics:
 * - `undefined` → not yet applicable
 * - `null` → explicitly cleared or intentionally absent
 */
export interface ReservationSchemaFields {
    /** Unique identifier of the reservation document. */
    readonly _id: Types.ObjectId;

    /**
     * Immutable snapshot of the showing at reservation time.
     *
     * @remarks
     * This snapshot is the authoritative source for
     * pricing, scheduling, and seating context and
     * must never be mutated after creation.
     */
    snapshot: ReservedShowingSnapshotSchemaFields;

    /**
     * User who initiated the reservation.
     *
     * @remarks
     * Stored as an ObjectId; may be populated at runtime.
     */
    user: Types.ObjectId;

    /**
     * Live reference to the source showing.
     *
     * @remarks
     * Retained for navigation, reporting, and analytics.
     * Historical data must always be read from {@link snapshot}.
     */
    showing: Types.ObjectId;

    /**
     * Total number of tickets in the reservation.
     *
     * @remarks
     * Must be a positive integer and consistent with
     * {@link reservationType} and {@link selectedSeating}.
     */
    ticketCount: number;

    /**
     * Selected seating references.
     *
     * @remarks
     * - Required for `"RESERVED_SEATS"` reservations
     * - Must be omitted or `null` for `"GENERAL_ADMISSION"`
     * - Acts as a live reference only; authoritative seat
     *   state is captured in {@link snapshot}
     */
    selectedSeating?: Types.ObjectId[] | null;

    /**
     * Total amount paid for the reservation.
     *
     * @remarks
     * This value is authoritative and must not be derived
     * from ticket or seat pricing after payment.
     */
    pricePaid: PositiveNumber;

    /** Currency used for payment (ISO 4217). */
    currency: ISO4217CurrencyCode;

    /** Current lifecycle status of the reservation. */
    status: ReservationStatus;

    /** Timestamp when the reservation was created. */
    dateReserved: Date;

    /** Timestamp when payment was successfully completed. */
    datePaid?: Date | null;

    /** Timestamp when the reservation was cancelled. */
    dateCancelled?: Date | null;

    /** Timestamp when the reservation was refunded. */
    dateRefunded?: Date | null;

    /** Timestamp when the reservation expired without payment. */
    dateExpired?: Date | null;

    /**
     * Expiration timestamp for unpaid reservations.
     *
     * @remarks
     * - Must be future-dated while status is `"RESERVED"`
     * - Controlled exclusively by system logic
     */
    expiresAt: Date;

    /**
     * Reservation mode applied at booking time.
     *
     * @remarks
     * Determines whether explicit seat selection
     * is required.
     */
    reservationType: ReservationType;

    /**
     * Optional internal notes.
     *
     * @remarks
     * Intended for administrative or operational use.
     * Not exposed to end users by default.
     */
    notes?: string | null;
}

/**
 * Narrowed reservation document with enforced
 * seating invariants by {@link ReservationType}.
 *
 * @remarks
 * Ensures that:
 * - General admission reservations never include seating
 * - Reserved seating reservations always include seating
 */
export type ReservationDoc =
    Omit<ReservationSchemaFields, "reservationType" | "selectedSeating"> &
    (
        | { reservationType: "GENERAL_ADMISSION"; selectedSeating?: null }
        | { reservationType: "RESERVED_SEATS"; selectedSeating: Types.ObjectId[] }
        );
