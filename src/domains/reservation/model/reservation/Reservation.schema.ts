/**
 * @file Reservation.schema.ts
 *
 * @description
 * Mongoose schema for the Reservation entity.
 *
 * Combines a snapshot-based approach with live references to user, showing,
 * and selected seating. Includes fields for price, currency, reservation
 * status, and lifecycle timestamps (reserved, paid, cancelled, refunded,
 * expired). Enforces validation rules for conditional dates based on status,
 * positive pricing, and ISO 4217 currency codes.
 *
 * Indexes:
 * - Ensures unique reservation for a given showing and seat combination
 *   when status is "RESERVED".
 *
 * Validation highlights:
 * - `selectedSeating` must be a non-empty array.
 * - `pricePaid` must be a positive number.
 * - `currency` must be a valid ISO 4217 code.
 * - `status` must match one of the allowed reservation statuses.
 * - Conditional date fields must exist when status changes.
 * - `expiresAt` must be a future date if status is "RESERVED".
 *
 * Intended for use in:
 * - Booking/reservation management
 * - Payment tracking
 * - Audit/history of seat reservations
 */

import { Schema, Types } from "mongoose";
import { ReservedShowingSnapshotSchema } from "../snapshots/showing-snapshot/ReservedShowingSnapshot.schema.js";
import type { ReservationSchemaFields } from "./Reservation.types.js";
import ISO4217CurrencyCodesConstant from "../../../../shared/constants/currency/ISO4217CurrencyCodesConstant.js";
import ReservationStatusConstant from "../../constants/ReservationStatusConstant.js";
import { DateTime } from "luxon";

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
    selectedSeating: {
        type: [{ type: Schema.Types.ObjectId, ref: "SeatMap" }],
        required: [true, "Required for reservation."],
        validate: {
            message: "Must be a non-empty array.",
            validator: (arr: Types.ObjectId[]) => Array.isArray(arr) && arr.length > 0,
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
        validate: {
            message: "Required if the reservation has been paid.",
            validator: function (date: Date) {
                return this.status === "PAID" && !!date;
            },
        },
    },
    dateCancelled: {
        type: Date,
        validate: {
            message: "Required if the reservation has been cancelled.",
            validator: function (date: Date) {
                return this.status === "CANCELLED" && !!date;
            },
        },
    },
    dateRefunded: {
        type: Date,
        validate: {
            message: "Required if the reservation has been refunded.",
            validator: function (date: Date) {
                return this.status === "REFUNDED" && !!date;
            },
        },
    },
    dateExpired: {
        type: Date,
        validate: {
            message: "Required if the reservation has expired.",
            validator: function (date: Date) {
                return this.status === "EXPIRED" && !!date;
            },
        },
    },
    expiresAt: {
        type: Date,
        validate: {
            message: "Expiry cannot be in the past or missing for a reserved item.",
            validator: function (date: Date | null | undefined) {
                if (this.status !== "RESERVED") return true;
                if (!date) return false;

                const now = DateTime.now().toUTC();
                const checkDate = DateTime.fromJSDate(date).toUTC();

                return checkDate > now;
            },
        },
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

/**
 * Unique index ensuring that a seat in a given showing can only be reserved once.
 */
ReservationSchema.index(
    { showing: 1, "selectedSeating.seatIdentifier": 1 },
    { unique: true, sparse: true, partialFilterExpression: { status: "RESERVED" } }
);

export default ReservationSchema;
