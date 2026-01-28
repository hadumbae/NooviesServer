/**
 * @file Reservation.types.ts
 *
 * Core schema field definitions for a reservation.
 *
 * Describes a reservation entity composed of:
 * - an immutable snapshot of the reserved showing
 * - live references to the user, showing, and seating
 * - financial metadata
 * - lifecycle state and timestamps
 *
 * Designed to support reservation, payment, cancellation,
 * expiration, and refund workflows.
 */

import type {ReservedShowingSnapshotSchemaFields} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.types.js";
import type {ShowingSchemaFields} from "../../../showing/model/showing/Showing.types.js";
import type {SeatMapSchemaFields} from "../../../seatmap/model/SeatMap.types.js";
import type UserSchemaFields from "@models/UserSchemaFields.js";
import {Types} from "mongoose";
import type {ISO4217CurrencyCode} from "../../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";
import type {PositiveNumber} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import type {ReservationType} from "../../schemas/enum/ReservationTypeEnumSchema.js";

/**
 * Reservation schema fields.
 *
 * @remarks
 * Uses a snapshot-based model to preserve historical,
 * financial, and seating integrity even if referenced
 * entities change.
 *
 * Lifecycle-dependent requirements based on {@link ReservationStatus}:
 * - `"RESERVED"` → `dateReserved`, `expiresAt` (future-dated)
 * - `"PAID"` → `datePaid`
 * - `"CANCELLED"` → `dateCancelled`
 * - `"REFUNDED"` → `dateRefunded`
 * - `"EXPIRED"` → `dateExpired`
 *
 * Optional and nullable fields distinguish between:
 * - `undefined` → not yet set or not applicable
 * - `null` → explicitly cleared or intentionally absent
 */
export interface ReservationSchemaFields {
    /** Unique identifier of the reservation document. */
    readonly _id: Types.ObjectId;

    /** Immutable snapshot of the reserved showing state. */
    snapshot: ReservedShowingSnapshotSchemaFields;

    /** Reserving user (ID or populated document). */
    user: Types.ObjectId | UserSchemaFields;

    /** Referenced showing (ID or populated document). */
    showing: Types.ObjectId | ShowingSchemaFields;

    /**
     * Total number of tickets included in the reservation.
     *
     * @remarks
     * Must be a positive integer.
     */
    ticketCount: number;

    /**
     * Selected seating references (IDs or populated documents).
     *
     * @remarks
     * - Required and non-empty for reserved seating reservations
     * - Must be absent for general admission reservations
     */
    selectedSeating?: (Types.ObjectId | SeatMapSchemaFields)[] | null;

    /** Total price paid for the reservation. */
    pricePaid: PositiveNumber;

    /** Currency in which the reservation was paid (ISO 4217). */
    currency: ISO4217CurrencyCode;

    /** Current lifecycle status of the reservation. */
    status: ReservationStatus;

    /** Timestamp when the reservation was created. */
    dateReserved: Date;

    /** Timestamp when the reservation was paid. */
    datePaid?: Date | null;

    /** Timestamp when the reservation was cancelled. */
    dateCancelled?: Date | null;

    /** Timestamp when the reservation was refunded. */
    dateRefunded?: Date | null;

    /** Timestamp when the reservation expired. */
    dateExpired?: Date | null;

    /**
     * Expiration timestamp for unpaid reservations.
     *
     * @remarks
     * Must be future-dated when status is `"RESERVED"`.
     */
    expiresAt: Date;

    /** Reservation mode (e.g. general admission vs reserved seating). */
    type: ReservationType;

    /**
     * Optional notes associated with the reservation.
     *
     * @remarks
     * Intended for internal annotations or operational context.
     */
    notes?: string | null;
}
