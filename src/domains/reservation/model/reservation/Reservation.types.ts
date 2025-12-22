/**
 * @file Reservation.types.ts
 *
 * @description
 * Core schema field definitions for a reservation.
 *
 * Represents a live reservation entity, combining an immutable snapshot of
 * the reserved showing with references to the user, showing, and selected
 * seating. Supports booking, payment, cancellation, expiration, and refund
 * workflows, with strict validation and conditional fields based on status.
 */

import type { ReservedShowingSnapshotSchemaFields } from "../snapshots/showing-snapshot/ReservedShowingSnapshot.types.js";
import type { ShowingSchemaFields } from "../../../showing/model/Showing.types.js";
import type { SeatMapSchemaFields } from "../../../seatmap/model/SeatMap.types.js";
import type UserSchemaFields from "@models/UserSchemaFields.js";
import { Types } from "mongoose";
import type { ISO4217CurrencyCode } from "../../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import type { ReservationStatus } from "../../schemas/enum/ReservationStatusEnumSchema.js";
import type { PositiveNumber } from "../../../../shared/schema/numbers/PositiveNumberSchema.js";

/**
 * Reservation schema fields.
 *
 * Uses a snapshot-based approach to guarantee historical and financial
 * integrity. Certain fields are conditional based on the reservation status:
 * - `datePaid` must exist when status is "PAID"
 * - `dateCancelled` must exist when status is "CANCELLED"
 * - `dateRefunded` must exist when status is "REFUNDED"
 * - `dateExpired` must exist when status is "EXPIRED"
 * - `expiresAt` must be a future date if status is "RESERVED"
 */
export interface ReservationSchemaFields {
    /** Immutable snapshot of the reserved showing and selected seats. */
    snapshot: ReservedShowingSnapshotSchemaFields;

    /** Reserving user (ID or populated document). */
    user: Types.ObjectId | UserSchemaFields;

    /** Referenced showing (ID or populated document). */
    showing: Types.ObjectId | ShowingSchemaFields;

    /** Selected seating references (IDs or populated documents). */
    selectedSeating: (Types.ObjectId | SeatMapSchemaFields)[];

    /** Total price paid for the reservation. */
    pricePaid: PositiveNumber;

    /** Currency in which the reservation was paid (ISO 4217). */
    currency: ISO4217CurrencyCode;

    /** Current lifecycle status of the reservation. */
    status: ReservationStatus;

    /** Timestamp when the reservation was created. */
    dateReserved: Date;

    /** Timestamp when the reservation was paid; required if status is "PAID". */
    datePaid?: Date;

    /** Timestamp when the reservation was cancelled; required if status is "CANCELLED". */
    dateCancelled?: Date;

    /** Timestamp when the reservation was refunded; required if status is "REFUNDED". */
    dateRefunded?: Date;

    /** Timestamp when the reservation expired; required if status is "EXPIRED". */
    dateExpired?: Date;

    /**
     * Optional expiration timestamp for unpaid reservations.
     * Must be in the future if status is "RESERVED".
     */
    expiresAt?: Date;

    /**
     * Optional textual notes or comments associated with the reservation.
     * Can be used for internal tracking, user messages, or special instructions.
     */
    notes?: string;
}
