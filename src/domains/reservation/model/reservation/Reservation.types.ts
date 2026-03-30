/**
 * @file Type definitions and schema field structures for the Mongoose Reservation model.
 * @filename Reservation.types.ts
 */

import type {ReservedShowingSnapshotSchemaFields} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.types.js";
import {Types} from "mongoose";
import type {ISO4217CurrencyCode} from "@shared/schema/enums/ISO4217CurrencyCodeEnumSchema";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";
import type {ReservationType} from "../../schemas/enum/ReservationTypeEnumSchema.js";
import type {NonNegativeNumber} from "@shared/schema/numbers/NonNegativeNumberSchema";
import type {BaseModelWithSlug} from "@shared/types/schema/BaseModel";
import type {ModelTimestamps} from "@shared/types/schema/ModelTimestamps";
import type {ModelSoftDelete} from "@shared/types/schema/ModelSoftDelete";

/**
 * Composite metadata for the Reservation model.
 * Includes base identification, slug-based routing, automated timestamps, and soft-deletion support.
 */
type ReservationModelMeta = BaseModelWithSlug & ModelTimestamps & ModelSoftDelete;

/**
 * Lifecycle date fields for tracking the state transitions of a reservation.
 * Used for auditing and calculating time-to-live (TTL) logic.
 */
type ReservationDateSchemaFields = {
    /** Explicit timestamp of the initial seat/ticket reservation. */
    dateReserved: Date;

    /** Timestamp recorded when payment is successfully confirmed by the gateway. */
    datePaid?: Date | null;

    /** Timestamp recorded if the reservation is manually voided by a user or administrator. */
    dateCancelled?: Date | null;

    /** Timestamp recorded when a financial refund has been processed for a paid reservation. */
    dateRefunded?: Date | null;

    /** Timestamp recorded if the reservation was not paid within the allocated TTL window. */
    dateExpired?: Date | null;

    /** The system-calculated deadline by which the reservation must be finalized. */
    expiresAt: Date;
}

/**
 * Defines financial and quantity data for the reservation transaction.
 */
type ReservationPaymentSchemaFields = {
    /** Total quantity of tickets requested in the booking. */
    ticketCount: number;

    /** The final monetary amount calculated and processed for the transaction. */
    pricePaid: NonNegativeNumber;

    /** Standardized 3-letter currency code (e.g., USD, EUR). */
    currency: ISO4217CurrencyCode;

    /** Flag indicating if the payment has been successfully captured. */
    isPaid: boolean;
}

/**
 * Defines relational associations and immutable data snapshots.
 */
type ReservationRelatedSchemaFields = {
    /** Reference to the User account associated with this booking. */
    user: Types.ObjectId;

    /** Reference to the specific Showing event being attended. */
    showing: Types.ObjectId;

    /** * A point-in-time copy of showing details.
     * Protects against data drift if the original showing metadata changes after booking.
     */
    snapshot: ReservedShowingSnapshotSchemaFields;
}

/**
 * Defines identification and configuration metadata.
 */
type ReservationMetaSchemaFields = {
    /** List of specific seat IDs; only populated when `reservationType` is 'RESERVED_SEATS'. */
    selectedSeating?: Types.ObjectId[] | null;

    /** Current lifecycle status (e.g., RESERVED, PAID, CANCELLED, EXPIRED). */
    status: ReservationStatus;

    /** Discriminator for booking logic (General Admission vs Assigned Seating). */
    reservationType: ReservationType;

    /** Human-readable alphanumeric code for ticket verification and administrative lookups. */
    uniqueCode: string;

    /** Optional administrative remarks or user-provided notes (max 3000 chars). */
    notes?: string | null;
};

/**
 * Comprehensive field definitions for the Reservation schema.
 */
export type ReservationSchemaFields =
    ReservationModelMeta &
    ReservationDateSchemaFields &
    ReservationPaymentSchemaFields &
    ReservationRelatedSchemaFields &
    ReservationMetaSchemaFields;

/**
 * Refined TypeScript type for the Reservation document using Discriminated Unions.
 */
export type ReservationDoc = Omit<ReservationSchemaFields, "reservationType" | "selectedSeating"> & (
    | {
    /** Open seating where specific positions are not tracked or allocated. */
    reservationType: "GENERAL_ADMISSION";
    selectedSeating?: null
}
    | {
    /** Specific assigned seating requiring valid seat references. */
    reservationType: "RESERVED_SEATS";
    selectedSeating: Types.ObjectId[]
}
    );