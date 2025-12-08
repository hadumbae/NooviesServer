/**
 * ## SeatSchema
 *
 * Mongoose schema representing a single seat within a theatre screen.
 * Each seat is uniquely identified by its row and seat number as well as
 * its position (x, y) in the layout grid. This schema supports multiple
 * seat types, layout types, price multipliers, and availability status.
 *
 * @remarks
 * - Uses `SeatTypeConstant` and `SeatLayoutTypeConstant` for strict value enforcement.
 * - Automatically manages `createdAt` and `updatedAt` timestamps.
 * - Supports compound indexes for enforcing uniqueness of seat identifiers
 *   and coordinates within a theatre screen.
 *
 * @example
 * ```ts
 * import { SeatSchema } from "@/pages/seat/model/Seat.schema.ts";
 * import mongoose from "mongoose";
 *
 * const SeatModel = mongoose.model("Seat", SeatSchema);
 *
 * const newSeat = await SeatModel.create({
 *   theatre: "64f1c0c8ab1234567890abcd",
 *   screen: "64f1c0c8ab1234567890abce",
 *   row: "A",
 *   seatNumber: 1,
 *   seatType: "VIP",
 *   layoutType: "Seat",
 *   isAvailable: true,
 *   x: 1,
 *   y: 1,
 *   priceMultiplier: 1.5
 * });
 * ```
 */

import {Schema} from "mongoose";
import type ISeat from "./Seat.interface.js";
import SeatTypeConstant from "../constant/SeatTypeConstant.js";
import SeatLayoutTypeConstant from "../constant/SeatLayoutTypeConstant.js";

export const SeatSchema = new Schema<ISeat>({
    /** Reference to the Theatre this seat belongs to. */
    theatre: {
        type: Schema.Types.ObjectId,
        ref: 'Theatre',
        required: [true, "Theatre is required."],
    },

    /** Reference to the Screen this seat belongs to. */
    screen: {
        type: Schema.Types.ObjectId,
        ref: 'Screen',
        required: [true, "Screen is required."],
    },

    /** The row identifier of the seat (e.g., 'A', 'B'). Must be 1–10 characters. */
    row: {
        type: String,
        minlength: [1, "Row must not be an empty string."],
        maxLength: [10, "Row must be 10 characters or less."],
        required: [true, "Row is required."],
    },

    /** The seat number within the row. Required for layoutType "Seat". Must be ≥ 1. */
    seatNumber: {
        type: Number,
        min: [1, "Seat Number must be 1 or more."],
        required: [
            function () {
                return this.layoutType === "SEAT";
            },
            "Seat Number is required for seat.",
        ],
    },

    /** Optional label for the seat (e.g., 'Front Left', 'Aisle Seat'). Max 50 characters. */
    seatLabel: {
        type: String,
        minlength: [1, "Seat Label must not be empty strings."],
        maxLength: [50, "Seat Label must be 50 characters or less."],
        trim: true,
        validate: {
            message: "Seat Label must be empty for non-seat entries.",
            validator: function (value) {
                if (this.layoutType === "SEAT") return true;
                return value === undefined || value === null;
            },
        }
    },

    /** The type of seat (e.g., Regular, VIP, Premium). Defaults to the first SeatTypeConstant. */
    seatType: {
        type: String,
        enum: SeatTypeConstant,
        default: SeatTypeConstant[0],
        required: [
            function () {
                return this.layoutType === "SEAT";
            },
            "Seat Type is required.",
        ],
    },

    /** Layout type of the seat (Seat, Aisle, Stair). Defaults to the first SeatLayoutTypeConstant. */
    layoutType: {
        type: String,
        enum: SeatLayoutTypeConstant,
        default: SeatLayoutTypeConstant[0],
        required: [true, "Layout Type is required."],
    },

    /** Whether the seat is currently available for booking. Defaults to true. */
    isAvailable: {
        type: Boolean,
        default: true,
        required: [
            function () {
                return this.layoutType === "SEAT";
            },
            "Is Available is required.",
        ],
    },

    /** X-coordinate of the seat on the screen layout grid. Must be integer ≥ 1. */
    x: {
        type: Number,
        min: [1, "X must be 1 or more."],
        required: [true, "X coordinate is required."],
        validate: {
            validator: Number.isInteger,
            message: "X must be an integer.",
        },
    },

    /** Y-coordinate of the seat on the screen layout grid. Must be integer ≥ 1. */
    y: {
        type: Number,
        min: [1, "Y must be 1 or more."],
        required: [true, "Y coordinate is required."],
        validate: {
            validator: Number.isInteger,
            message: "Y must be an integer.",
        },
    },

    /** Multiplier applied to the base price for this seat. Must be ≥ 0. Defaults to 1.0. */
    priceMultiplier: {
        type: Number,
        default: 1.0,
        min: [0, "Price Multiplier must be 0 or more."],
        required: [
            function () {
                return this.layoutType === "SEAT";
            },
            "Price Multiplier is required.",
        ],
    },
}, {
    /** Automatically manage createdAt and updatedAt timestamps. */
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});

/**
 * Compound index to ensure uniqueness of seats within a theatre screen by row + seatNumber.
 */
SeatSchema.index(
    {theatre: 1, screen: 1, row: 1, seatNumber: 1},
    {unique: true, partialFilterExpression: {seatNumber: {$exists: true}}},
);

/**
 * Compound index to ensure uniqueness of seat coordinates within a theatre screen by x + y.
 */
SeatSchema.index(
    {theatre: 1, screen: 1, x: 1, y: 1},
    {unique: true},
);
