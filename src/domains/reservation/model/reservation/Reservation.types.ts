/**
 * @file Reservation.types.ts
 *
 * Core field definitions for a reservation.
 *
 * A reservation represents a transactional record composed of:
 * - an immutable snapshot of the reserved showing
 * - live references to user, showing, and seating
 * - authoritative financial data
 * - lifecycle state and timestamps
 *
 * Designed to support reservation, payment, cancellation,
 * expiration, and refund workflows while preserving historical integrity.
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
 * This model uses a snapshot-first design to guarantee that pricing,
 * scheduling, language, and seating data remain historically accurate
 * even if referenced entities are later modified or deleted.
 *
 * Lifecycle-dependent invariants based on {@link ReservationStatus}:
 * - `"RESERVED"` → `dateReserved`, `expiresAt` (future-dated)
 * - `"PAID"` → `datePaid`
 * - `"CANCELLED"` → `dateCancelled`
 * - `"REFUNDED"` → `dateRefunded`
 * - `"EXPIRED"` → `dateExpired`
 *
 * Optional vs nullable fields:
 * - `undefined` → not yet applicable or not assigned
 * - `null` → explicitly cleared or intentionally absent
 */
export interface ReservationSchemaFields {
    /** Unique identifier of the reservation document. */
    readonly _id: Types.ObjectId;

    /**
     * Immutable snapshot of the showing at reservation time.
     *
     * @remarks
     * This snapshot is authoritative for historical, pricing,
     * and scheduling data and must never be mutated.
     */
    snapshot: ReservedShowingSnapshotSchemaFields;

    /**
     * Reserving user reference.
     *
     * @remarks
     * Stored as an ObjectId; may be populated at runtime.
     */
    user: Types.ObjectId;

    /**
     * Live reference to the source showing.
     *
     * @remarks
     * Maintained for navigation and reporting only.
     */
    showing: Types.ObjectId;

    /**
     * Total number of tickets included in the reservation.
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
     * - Required and non-empty for reserved seating reservations
     * - Must be omitted or null for general admission reservations
     * - Serves as a live reference; authoritative seat data lives in {@link snapshot}
     */
    selectedSeating?: Types.ObjectId[] | null;

    /**
     * Total price paid for the reservation.
     *
     * @remarks
     * Authoritative financial value; must not be recalculated
     * from ticket or seat pricing after payment.
     */
    pricePaid: PositiveNumber;

    /** Currency used for payment (ISO 4217). */
    currency: ISO4217CurrencyCode;

    /** Current lifecycle status of the reservation. */
    status: ReservationStatus;

    /** Timestamp when the reservation was initially created. */
    dateReserved: Date;

    /** Timestamp when payment was completed. */
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
     * Must be future-dated while status is `"RESERVED"`.
     * Controlled by system logic rather than user input.
     */
    expiresAt: Date;

    /**
     * Reservation mode applied at booking time.
     *
     * @remarks
     * Determines whether seat selection is required.
     */
    reservationType: ReservationType;

    /**
     * Optional internal notes.
     *
     * @remarks
     * Intended for administrative or operational context.
     * Not shown to end users by default.
     */
    notes?: string | null;
}
