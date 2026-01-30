/**
 * @file Reservation.schema.ts
 *
 * Mongoose schema for the Reservation entity.
 *
 * Models a reservation using a snapshot-based approach combined with
 * live references to the user, showing, and seating.
 *
 * Captures financial data, reservation type, lifecycle status, and
 * status-dependent timestamps (reserved, paid, cancelled, refunded,
 * expired). Lifecycle invariants are enforced through schema validation
 * and document middleware.
 *
 * Indexes:
 * - Ensures a seat within a showing may only be reserved once
 *   while the reservation status is `"RESERVED"`.
 *
 * Validation highlights:
 * - `ticketCount` must be ≥ 1
 * - `pricePaid` must be a positive number
 * - `currency` must be a valid ISO 4217 code
 * - `status` must be a valid reservation lifecycle value
 * - Lifecycle date fields are required conditionally based on `status`
 * - `expiresAt` must be future-dated when status is `"RESERVED"`
 * - `selectedSeating` rules depend on reservation `type`
 *
 * Intended for:
 * - Reservation and booking management
 * - Payment and refund tracking
 * - Auditing seat allocation over time
 */

import {Schema} from "mongoose";
import {ReservedShowingSnapshotSchema} from "../snapshots/showing-snapshot/ReservedShowingSnapshot.schema.js";
import type {ReservationSchemaFields} from "./Reservation.types.js";
import ISO4217CurrencyCodesConstant from "../../../../shared/constants/currency/ISO4217CurrencyCodesConstant.js";
import ReservationStatusConstant from "../../constants/ReservationStatusConstant.js";
import {ReservationTypeConstant} from "../../constants/ReservationTypeConstant.js";

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
            message: "Must be a positive number.",
            validator: (num: number) => num > 0,
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
});

export default ReservationSchema;
