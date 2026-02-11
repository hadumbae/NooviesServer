/**
 * @file Reservation.schema.ts
 *
 * Mongoose schema definition for the Reservation model.
 */

import {Schema} from "mongoose";
import {ReservedShowingSnapshotSchema} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.schema.js";
import type {ReservationSchemaFields} from "./Reservation.types.js";
import ISO4217CurrencyCodesConstant from "../../../../shared/constants/currency/ISO4217CurrencyCodesConstant.js";
import ReservationStatusConstant from "../../constants/ReservationStatusConstant.js";
import {ReservationTypeConstant} from "../../constants/ReservationTypeConstant.js";
import SlugSchemaTypeOptions from "../../../../shared/model/SlugSchemaTypeOptions.js";

/**
 * Reservation schema.
 *
 * Represents a booking transaction tied to a user and showing.
 *
 * Includes:
 * - Immutable showing snapshot
 * - Financial data
 * - Lifecycle status tracking
 * - Optional seat selection
 *
 * @remarks
 * Cross-field validation and lifecycle invariants are enforced
 * via schema middleware (see `Reservation.hooks.ts`).
 */
const ReservationSchema = new Schema<ReservationSchemaFields>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Required for reservation."],
    },

    showing: {
        type: Schema.Types.ObjectId,
        ref: "Showing",
        required: [true, "Required for reservation."],
    },

    ticketCount: {
        type: Number,
        min: [1, "Must be 1 or more."],
        required: [true, "Ticket count is required."],
    },

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

    pricePaid: {
        type: Number,
        validate: {
            message: "Must not be a negative number.",
            validator: (num: number) => num >= 0,
        },
        required: [true, "Required for reservation."],
    },

    currency: {
        type: String,
        enum: {
            values: ISO4217CurrencyCodesConstant,
            message: "Must be a valid ISO 4217 currency code.",
        },
        required: [true, "Required for reservation."],
    },

    status: {
        type: String,
        enum: {
            values: ReservationStatusConstant,
            message: `Must be a valid status. Valid: ${ReservationStatusConstant.join(", ")}`,
        },
        required: [true, "Required for reservation."],
    },

    dateReserved: {
        type: Date,
        required: [true, "Required for reservation."],
    },

    datePaid: {
        type: Date,
    },

    dateCancelled: {
        type: Date,
    },

    dateRefunded: {
        type: Date,
    },

    dateExpired: {
        type: Date,
    },

    expiresAt: {
        type: Date,
        required: [true, "Expiry date is required for all reservations."],
    },

    reservationType: {
        type: String,
        enum: {
            values: ReservationTypeConstant,
            message: "Invalid type value.",
        },
        required: [true, "Type is required for reservation."],
    },

    snapshot: {
        type: ReservedShowingSnapshotSchema,
        immutable: true,
        required: [true, "Snapshot is required."],
    },

    notes: {
        type: String,
        min: [1, "Must not be an empty string."],
        max: [3000, "Must not be more than 3000 characters."],
        trim: true,
    },

    slug: SlugSchemaTypeOptions,
});

export default ReservationSchema;
