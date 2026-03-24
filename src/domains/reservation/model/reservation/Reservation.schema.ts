/**
 * @file Mongoose schema definition for the Reservation model.
 * @filename Reservation.schema.ts
 */

import {Schema} from "mongoose";
import {ReservedShowingSnapshotSchema} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.schema.js";
import type {ReservationSchemaFields} from "./Reservation.types.js";
import ISO4217CurrencyCodesConstant from "../../../../shared/constants/currency/ISO4217CurrencyCodesConstant.js";
import ReservationStatusConstant from "../../constants/ReservationStatusConstant.js";
import {ReservationTypeConstant} from "../../constants/ReservationTypeConstant.js";
import SlugSchemaTypeOptions from "../../../../shared/model/SlugSchemaTypeOptions.js";
import {IsDeletedSchemaTypeOptions} from "../../../../shared/model/IsDeletedSchemaTypeOptions.js";
import {DeletedAtSchemaTypeOptions} from "../../../../shared/model/DeletedAtSchemaTypeOptions.js";

/**
 * Mongoose schema representing a booking transaction.
 * ---
 * ### Key Features
 * * **Relational Integrity:** Links `User` and `Showing` with strict required-field validation.
 * * **Snapshotting:** Persists an immutable {@link ReservedShowingSnapshotSchema} to protect historical
 * data against future changes to the original Movie or Showing.
 * * **Seating Logic:** Supports both `GENERAL_ADMISSION` and `RESERVED_SEATS` via conditional
 * `selectedSeating` validation.
 * * **Financial Tracking:** Enforces non-negative pricing and valid ISO 4217 currency codes.
 * * **Lifecycle Management:** Includes explicit date fields for payment, cancellation, and
 * expiration, along with a mandatory `expiresAt` deadline.
 * * **System Metadata:** Standardized audit trails (timestamps), SEO-friendly slugs, and soft-delete support.
 */
const ReservationSchema = new Schema<ReservationSchemaFields>({
    /** Reference to the User who initiated the booking. */
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Required for reservation."],
    },

    /** Reference to the specific Showing event being booked. */
    showing: {
        type: Schema.Types.ObjectId,
        ref: "Showing",
        required: [true, "Required for reservation."],
    },

    /** Total number of tickets requested for this transaction. */
    ticketCount: {
        type: Number,
        min: [1, "Must be 1 or more."],
        required: [true, "Ticket count is required."],
    },

    /** * Collection of specific seat references.
     * Validated to ensure it's either null (for GA) or a non-empty array.
     */
    selectedSeating: {
        type: [{type: Schema.Types.ObjectId, ref: "SeatMap"}],
        validate: {
            message: "Must be a non-empty array.",
            validator: (arr: unknown) =>
                arr === null ||
                arr === undefined ||
                (Array.isArray(arr) && arr.length > 0),
        },
    },

    /** The actual total amount paid, stored as a non-negative number. */
    pricePaid: {
        type: Number,
        validate: {
            message: "Must not be a negative number.",
            validator: (num: number) => num >= 0,
        },
        required: [true, "Required for reservation."],
    },

    /** The currency of the transaction. */
    currency: {
        type: String,
        enum: {
            values: ISO4217CurrencyCodesConstant,
            message: "Must be a valid ISO 4217 currency code.",
        },
        required: [true, "Required for reservation."],
    },

    /** Current state of the reservation (e.g., Pending, Paid, Cancelled). */
    status: {
        type: String,
        enum: {
            values: ReservationStatusConstant,
            message: `Must be a valid status. Valid: ${ReservationStatusConstant.join(", ")}`,
        },
        required: [true, "Required for reservation."],
    },

    /** Primary lifecycle dates. */
    dateReserved: { type: Date, required: [true, "Required for reservation."] },
    datePaid: { type: Date },
    dateCancelled: { type: Date },
    dateRefunded: { type: Date },
    dateExpired: { type: Date },

    /** The hard deadline for payment before the system releases the held inventory. */
    expiresAt: {
        type: Date,
        required: [true, "Expiry date is required for all reservations."],
    },

    /** Determines if seating is assigned or general admission. */
    reservationType: {
        type: String,
        enum: {
            values: ReservationTypeConstant,
            message: "Invalid type value.",
        },
        required: [true, "Type is required for reservation."],
    },

    /** An immutable point-in-time copy of showing/movie data for audit/ticket integrity. */
    snapshot: {
        type: ReservedShowingSnapshotSchema,
        immutable: true,
        required: [true, "Snapshot is required."],
    },

    /** Optional notes with trim and length constraints. */
    notes: {
        type: String,
        min: [1, "Must not be an empty string."],
        max: [3000, "Must not be more than 3000 characters."],
        trim: true,
    },

    /** A human-readable verification code (e.g., for QR codes or ticket printing). */
    uniqueCode: {
        type: String,
        trim: true,
        max: [50, "Must not be more than 50 characters."],
        required: [true, "Unique Code is required."],
    },

    /** Pre-defined SEO/ID options for URL generation. */
    slug: SlugSchemaTypeOptions,

    /** Pre-defined soft-delete flags and timestamps. */
    isDeleted: IsDeletedSchemaTypeOptions,
    deletedAt: DeletedAtSchemaTypeOptions,
}, {
    /** Automatically adds and manages `createdAt` and `updatedAt` fields. */
    timestamps: true,
});

export default ReservationSchema;