/**
 * @file Mongoose schema definition and model type for the Reservation domain.
 * @filename Reservation.schema.ts
 */

import {type Model, Schema} from "mongoose";
import {ReservedShowingSnapshotSchema} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.schema.js";
import type {ReservationSchemaFields} from "./Reservation.types.js";
import ISO4217CurrencyCodesConstant from "../../../../shared/constants/currency/ISO4217CurrencyCodesConstant.js";
import ReservationStatusConstant from "../../constants/ReservationStatusConstant.js";
import {ReservationTypeConstant} from "../../constants/ReservationTypeConstant.js";
import SlugSchemaTypeOptions from "../../../../shared/model/SlugSchemaTypeOptions.js";
import {IsDeletedSchemaTypeOptions} from "@shared/model/IsDeletedSchemaTypeOptions";
import {DeletedAtSchemaTypeOptions} from "@shared/model/DeletedAtSchemaTypeOptions";
import type {ModelSoftDeleteMethods} from "@shared/types/schema/ModelSoftDelete";

/**
 * TypeScript type representing the compiled Reservation Model.
 */
export type ReservationModel = Model<ReservationSchemaFields, {}, ModelSoftDeleteMethods<ReservationSchemaFields>>;

/**
 * Mongoose schema representing a booking transaction.
 */
const ReservationSchema = new Schema<
    ReservationSchemaFields,
    ReservationModel,
    ModelSoftDeleteMethods<ReservationSchemaFields>
>({
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

    /**
     * Collection of specific seat references.
     * Validated to ensure it is either null (for GA) or a non-empty array of ObjectIDs.
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

    /** The total amount paid, stored as a non-negative number. */
    pricePaid: {
        type: Number,
        validate: {
            message: "Must not be a negative number.",
            validator: (num: number) => num >= 0,
        },
        required: [true, "Required for reservation."],
    },

    /** The ISO 4217 currency code used for the transaction. */
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

    /** Timestamps for various business lifecycle stages. */
    dateReserved: {type: Date, required: [true, "Required for reservation."]},
    datePaid: {type: Date},
    dateCancelled: {type: Date},
    dateRefunded: {type: Date},
    dateExpired: {type: Date},

    /** The hard deadline for payment before the system releases held inventory. */
    expiresAt: {
        type: Date,
        required: [true, "Expiry date is required for all reservations."],
    },

    /** Distinguishes between assigned seating and general admission logic. */
    reservationType: {
        type: String,
        enum: {
            values: ReservationTypeConstant,
            message: "Invalid type value.",
        },
        required: [true, "Type is required for reservation."],
    },

    /** Direct flag for payment confirmation; defaults to false until gateway callback. */
    isPaid: {
        type: Boolean,
        default: false,
    },

    /** Immutable point-in-time copy of data to ensure ticket integrity if source records change. */
    snapshot: {
        type: ReservedShowingSnapshotSchema,
        immutable: true,
        required: [true, "Snapshot is required."],
    },

    /** Optional descriptive notes with length constraints. */
    notes: {
        type: String,
        min: [1, "Must not be an empty string."],
        max: [3000, "Must not be more than 3000 characters."],
        trim: true,
    },

    /** Unique human-readable verification code. Indexed for fast lookups. */
    uniqueCode: {
        type: String,
        trim: true,
        unique: [true, "Unique code must be unique."],
        max: [50, "Must not be more than 50 characters."],
        required: [true, "Unique Code is required."],
    },

    /** Standardized SEO-friendly slug options. */
    slug: SlugSchemaTypeOptions,

    /** Logic flags and timestamps for soft-deletion. */
    isDeleted: IsDeletedSchemaTypeOptions,
    deletedAt: DeletedAtSchemaTypeOptions,
}, {
    /** Automatically handles `createdAt` and `updatedAt` properties. */
    timestamps: true,
});

export default ReservationSchema;