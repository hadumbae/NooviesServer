/**
 * @file Type definitions and schema field structures for the Reservation domain.
 * @filename Reservation.types.ts
 */

import type {ReservedShowingSnapshotSchemaFields} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.types.js";
import {Types} from "mongoose";
import type {ISO4217CurrencyCode} from "../../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import type {ReservationStatus} from "../../schemas/enum/ReservationStatusEnumSchema.js";
import type {ReservationType} from "../../schemas/enum/ReservationTypeEnumSchema.js";
import type {NonNegativeNumber} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";
import type {BaseModelWithSlug} from "../../../../shared/types/schema/BaseModel.js";
import type {ModelTimestamps} from "../../../../shared/types/schema/ModelTimestamps.js";
import type {ModelSoftDelete} from "../../../../shared/types/schema/ModelSoftDelete.js";

/**
 * Composite metadata for the Reservation model.
 */
type ReservationModelMeta = BaseModelWithSlug & ModelTimestamps & ModelSoftDelete;

/**
 * Lifecycle date fields for tracking the state transitions of a reservation.
 */
type ReservationDateSchemaFields = {
    /** The timestamp when the initial booking was created. */
    dateReserved: Date;

    /** The timestamp when payment was successfully processed. */
    datePaid?: Date | null;

    /** The timestamp when the user or system manually cancelled the order. */
    dateCancelled?: Date | null;

    /** The timestamp when a refund was issued following a cancellation. */
    dateRefunded?: Date | null;

    /** The timestamp when the system automatically expired an unpaid temporary hold. */
    dateExpired?: Date | null;

    /** The calculated deadline by which the reservation must be paid before automatic expiration. */
    expiresAt: Date;
}

/**
 * Comprehensive field definitions for the Reservation schema.
 */
export type ReservationSchemaFields = ReservationModelMeta & ReservationDateSchemaFields & {
    /** Immutable point-in-time data of the showing at the moment of reservation. */
    snapshot: ReservedShowingSnapshotSchemaFields;

    /** Reference to the User who owns this reservation. */
    user: Types.ObjectId;

    /** Reference to the specific Showing event. */
    showing: Types.ObjectId;

    /** Total quantity of tickets purchased. */
    ticketCount: number;

    /** Optional array of specific seat references (only for RESERVED_SEATS type). */
    selectedSeating?: Types.ObjectId[] | null;

    /** Total amount paid by the customer. */
    pricePaid: NonNegativeNumber;

    /** The ISO 4217 currency code used for the transaction. */
    currency: ISO4217CurrencyCode;

    /** Current lifecycle status (e.g., PENDING, CONFIRMED, CANCELLED). */
    status: ReservationStatus;

    /** The technical category of the reservation (General vs. Assigned seating). */
    reservationType: ReservationType;

    /** A short, human-readable identifier for ticket verification (e.g., "ABC-123"). */
    uniqueCode: string;

    /** Optional internal or user-provided notes. */
    notes?: string | null;
};

/**
 * Refined TypeScript type for the Reservation document.
 */
export type ReservationDoc = Omit<ReservationSchemaFields, "reservationType" | "selectedSeating"> & (
    | {
    /** Open seating where specific positions are not tracked. */
    reservationType: "GENERAL_ADMISSION";
    selectedSeating?: null
}
    | {
    /** Specific assigned seating requiring valid seat references. */
    reservationType: "RESERVED_SEATS";
    selectedSeating: Types.ObjectId[]
}
    );