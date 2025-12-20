/**
 * @file SeatSnapshotSchema.ts
 *
 * @summary
 * Mongoose schema for an immutable cinema seat snapshot.
 *
 * @description
 * Captures the state of a seat at a specific point in time.
 * Intended for embedding within higher-level snapshots
 * (e.g. Screen, Showing, Reservation) to preserve historical accuracy
 * even if the base seat definition later changes.
 *
 * This schema is not intended to be used as a standalone collection.
 */

import { Schema } from "mongoose";
import SeatTypeConstant from "../../constant/SeatTypeConstant.js";
import type { SeatSnapshotSchemaFields } from "./SeatSnapshot.types.js";

/**
 * Seat snapshot subdocument schema with validation rules.
 *
 * @remarks
 * - Coordinates (`x`, `y`) are 1-based integers
 * - `priceMultiplier` modifies the base ticket price at purchase time
 */
export const SeatSnapshotSchema = new Schema<SeatSnapshotSchemaFields>({
    seatName: {
        type: String,
        minlength: [1, "Seat Name must not be an empty string."],
        maxLength: [20, "Seat Name must be 20 characters or less."],
        required: [true, "Seat Name is required."],
    },

    seatType: {
        type: String,
        enum: SeatTypeConstant,
        required: [true, "Seat Type is required."],
    },

    seatLabel: {
        type: String,
        minlength: [1, "Seat Label must not be an empty string."],
        maxLength: [50, "Seat Label must be 50 characters or less."],
        trim: true,
    },

    priceMultiplier: {
        type: Number,
        min: [0, "Price Multiplier must be 0 or greater."],
        required: [true, "Price Multiplier is required."],
    },

    x: {
        type: Number,
        min: [1, "X must be 1 or greater."],
        required: [true, "X coordinate is required."],
        validate: {
            validator: Number.isInteger,
            message: "X must be an integer.",
        },
    },

    y: {
        type: Number,
        min: [1, "Y must be 1 or greater."],
        required: [true, "Y coordinate is required."],
        validate: {
            validator: Number.isInteger,
            message: "Y must be an integer.",
        },
    },
});
