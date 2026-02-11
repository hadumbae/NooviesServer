/**
 * @file Reservation.types.ts
 *
 * Type definitions for the Reservation domain model.
 */

import type {ReservedShowingSnapshotSchemaFields} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.types.js";
import {Types} from "mongoose";
import type {ISO4217CurrencyCode} from "../../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";
import type {ReservationType} from "../../schemas/enum/ReservationTypeEnumSchema.js";
import type {NonNegativeNumber} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";

/**
 * Core reservation fields.
 *
 * @remarks
 * Uses a snapshot-first design:
 * - Historical showing data is stored immutably in {@link snapshot}
 * - Live references exist for navigation and analytics
 * - Lifecycle timestamps are status-dependent
 */
export interface ReservationSchemaFields {
    readonly _id: Types.ObjectId;

    /** Immutable showing snapshot captured at reservation time. */
    snapshot: ReservedShowingSnapshotSchemaFields;

    /** User who initiated the reservation. */
    user: Types.ObjectId;

    /** Live showing reference. */
    showing: Types.ObjectId;

    /** Number of tickets reserved. */
    ticketCount: number;

    /**
     * Seat references.
     *
     * Required for `"RESERVED_SEATS"`,
     * absent for `"GENERAL_ADMISSION"`.
     */
    selectedSeating?: Types.ObjectId[] | null;

    /** Total paid amount (non-negative). */
    pricePaid: NonNegativeNumber;

    /** ISO 4217 currency code. */
    currency: ISO4217CurrencyCode;

    /** Current lifecycle status. */
    status: ReservationStatus;

    /** Reservation creation timestamp. */
    dateReserved: Date;

    /** Payment timestamp. */
    datePaid?: Date | null;

    /** Cancellation timestamp. */
    dateCancelled?: Date | null;

    /** Refund timestamp. */
    dateRefunded?: Date | null;

    /** Expiration timestamp (for unpaid reservations). */
    dateExpired?: Date | null;

    /** Expiration cutoff for unpaid reservations. */
    expiresAt: Date;

    /** Reservation mode at booking time. */
    reservationType: ReservationType;

    /** Optional internal notes. */
    notes?: string | null;

    /** URL-safe identifier derived from showing. */
    slug: string;
}

/**
 * Narrowed reservation document by reservation type.
 *
 * Enforces seating invariants at the type level.
 */
export type ReservationDoc = Omit<ReservationSchemaFields, "reservationType" | "selectedSeating"> & (
    | { reservationType: "GENERAL_ADMISSION"; selectedSeating?: null }
    | { reservationType: "RESERVED_SEATS"; selectedSeating: Types.ObjectId[] }
);
