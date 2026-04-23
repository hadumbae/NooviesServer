/**
 * @fileoverview Mongoose schema definition for theatre seats and layout elements.
 */

import { Schema } from "mongoose";
import SlugSchemaTypeOptions from "../../../shared/model/SlugSchemaTypeOptions.js";
import { SeatLayoutTypeConstant, SeatTypeConstant } from "domains/seat/validation";
import type {SeatSchemaFields} from "@domains/seat/model/Seat.types";

/**
 * Defines the persistence layer for seats, aisles, and stairs within a theatre screen.
 */
export const SeatSchema = new Schema<SeatSchemaFields>(
    {
        /** Reference to the parent theatre. */
        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: [true, "Theatre is required."],
        },

        /** Reference to the parent screen. */
        screen: {
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: [true, "Screen is required."],
        },

        /** Row identifier (e.g., 'A', 'B', 'C'). */
        row: {
            type: String,
            minlength: [1, "Row must not be an empty string."],
            maxLength: [10, "Row must be 10 characters or less."],
            required: [true, "Row is required."],
        },

        /** * Numeric seat identifier within the row.
         * Conditionally required only for functional 'SEAT' types.
         */
        seatNumber: {
            type: Number,
            min: [1, "Seat Number must be 1 or more."],
            required: [
                function (this: SeatSchemaFields) {
                    return this.layoutType === "SEAT";
                },
                "Seat Number is required for seat.",
            ],
        },

        /** Optional display label; strictly constrained to 'SEAT' layout types. */
        seatLabel: {
            type: String,
            minlength: [1, "Seat Label must not be empty strings."],
            maxLength: [50, "Seat Label must be 50 characters or less."],
            trim: true,
            validate: {
                message: "Seat Label must be empty for non-seat entries.",
                validator: function (this: SeatSchemaFields, value: string) {
                    if (this.layoutType === "SEAT") return true;
                    return value === undefined || value === null;
                },
            },
        },

        /** Category of seat determining luxury or accessibility levels. */
        seatType: {
            type: String,
            enum: SeatTypeConstant,
            default: SeatTypeConstant[0],
            required: [
                function (this: SeatSchemaFields) {
                    return this.layoutType === "SEAT";
                },
                "Seat Type is required.",
            ],
        },

        /** Grid classification: determines if the cell is a seat, aisle, or stair. */
        layoutType: {
            type: String,
            enum: SeatLayoutTypeConstant,
            default: SeatLayoutTypeConstant[0],
            required: [true, "Layout Type is required."],
        },

        /** Booking status; only relevant for 'SEAT' types. */
        isAvailable: {
            type: Boolean,
            default: true,
            required: [
                function (this: SeatSchemaFields) {
                    return this.layoutType === "SEAT";
                },
                "Is Available is required.",
            ],
        },

        /** Horizontal grid coordinate. */
        x: {
            type: Number,
            min: [1, "X must be 1 or more."],
            required: [true, "X coordinate is required."],
            validate: {
                validator: Number.isInteger,
                message: "X must be an integer.",
            },
        },

        /** Vertical grid coordinate. */
        y: {
            type: Number,
            min: [1, "Y must be 1 or more."],
            required: [true, "Y coordinate is required."],
            validate: {
                validator: Number.isInteger,
                message: "Y must be an integer.",
            },
        },

        /** Percentage-based multiplier for the base ticket price. */
        priceMultiplier: {
            type: Number,
            default: 1.0,
            min: [0, "Price Multiplier must be 0 or more."],
            required: [
                function (this: SeatSchemaFields) {
                    return this.layoutType === "SEAT";
                },
                "Price Multiplier is required.",
            ],
        },

        /** Generated URL identifier. */
        slug: SlugSchemaTypeOptions,
    },
    {
        timestamps: true,
    },
);