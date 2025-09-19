import { Schema } from "mongoose";
import type ISeat from "./Seat.interface.js";
import SeatTypeConstant from "../constant/SeatTypeConstant.js";

/**
 * Mongoose schema for a seat in a theatre screen.
 *
 * Each seat is uniquely identified within a theatre and screen by its row and seat number.
 */
export const SeatSchema = new Schema<ISeat>({
    /**
     * Reference to the Theatre this seat belongs to.
     */
    theatre: {
        type: Schema.Types.ObjectId,
        ref: 'Theatre',
        required: [true, "Theatre is required."],
    },

    /**
     * Reference to the Screen this seat belongs to.
     */
    screen: {
        type: Schema.Types.ObjectId,
        ref: 'Screen',
        required: [true, "Screen is required."],
    },

    /**
     * The row identifier of the seat (e.g., 'A', 'B', 'C').
     * Must be 1–10 characters and non-empty.
     */
    row: {
        type: String,
        minlength: [1, "Row must not be an empty string."],
        maxLength: [10, "Row must be 10 characters or less."],
        required: [true, "Row is required."],
    },

    /**
     * The seat number within the row. Must be ≥ 1.
     */
    seatNumber: {
        type: Number,
        min: [1, "Seat Number must be 1 or more."],
        required: [true, "Seat Number is required."],
    },

    /**
     * Optional label for the seat (e.g., 'Front Left', 'Aisle Seat').
     * Must be 1–50 characters if provided; trimmed automatically.
     */
    seatLabel: {
        type: String,
        minlength: [1, "Seat Label must not be empty strings."],
        maxLength: [50, "Seat Label must be 50 characters or less."],
        trim: true,
    },

    /**
     * The type of seat, e.g., Regular, VIP, Premium.
     * Defaults to the first value in `SeatTypeConstant`.
     */
    seatType: {
        type: String,
        enum: SeatTypeConstant,
        default: SeatTypeConstant[0],
        required: [true, "Seat Type is required."],
    },

    /**
     * Whether the seat is currently available for booking.
     * Defaults to `true`.
     */
    isAvailable: {
        type: Boolean,
        default: true,
        required: [true, "Is Available is required."],
    },

    /**
     * X-coordinate of the seat on the screen layout grid.
     * Must be an integer ≥ 1.
     */
    x: {
        type: Number,
        min: [1, "X must be 1 or more."],
        required: [true, "X coordinate is required."],
        validate: {
            validator: Number.isInteger,
            message: "X must be an integer."
        },
    },

    /**
     * Y-coordinate of the seat on the screen layout grid.
     * Must be an integer ≥ 1.
     */
    y: {
        type: Number,
        min: [1, "Y must be 1 or more."],
        required: [true, "Y coordinate is required."],
        validate: {
            validator: Number.isInteger,
            message: "Y must be an integer."
        },
    },

    /**
     * Multiplier applied to the base price for this seat.
     * Must be ≥ 0. Defaults to 1.0.
     */
    priceMultiplier: {
        type: Number,
        default: 1.0,
        min: [0, "Price Multiplier must be 0 or more."],
        required: [true, "Price Multiplier is required."],
    },
}, {
    /**
     * Automatically manage createdAt and updatedAt timestamps.
     */
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});

/**
 * Compound index to ensure uniqueness of seats within a theatre screen.
 * Guarantees no two seats can share the same row + seatNumber in the same theatre and screen.
 */
SeatSchema.index(
    { theatre: 1, screen: 1, row: 1, seatNumber: 1 },
    { unique: true },
);
