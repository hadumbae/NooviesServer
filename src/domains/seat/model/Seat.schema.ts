/**
 * @file Seat.schema.ts
 *
 * @summary
 * Mongoose schema definition for theatre seats.
 *
 * @description
 * Represents a single seat or layout element within a theatre screen.
 * Supports multiple seat types, layout types, positional coordinates,
 * pricing rules, and availability state.
 *
 * Enforces:
 * - Layout-aware validation rules
 * - Coordinate uniqueness
 * - Seat identity constraints within a screen
 */

import { Schema } from "mongoose";
import type {SeatSchemaFields} from "./Seat.types.js";
import SeatTypeConstant from "../constant/SeatTypeConstant.js";
import SeatLayoutTypeConstant from "../constant/SeatLayoutTypeConstant.js";
import SlugSchemaTypeOptions from "../../../shared/model/SlugSchemaTypeOptions.js";

/**
 * @summary
 * Seat persistence schema.
 *
 * @description
 * Defines seating layout data for a theatre screen, including:
 * - Row/seat identifiers
 * - Grid positioning
 * - Seat classification
 * - Pricing modifiers
 *
 * Automatically manages `createdAt` and `updatedAt` timestamps.
 */
export const SeatSchema = new Schema<SeatSchemaFields>(
    {
        /**
         * Theatre this seat belongs to.
         */
        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: [true, "Theatre is required."],
        },

        /**
         * Screen this seat belongs to.
         */
        screen: {
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: [true, "Screen is required."],
        },

        /**
         * Row identifier for the seat.
         *
         * @example "A"
         * @example "AA"
         */
        row: {
            type: String,
            minlength: [1, "Row must not be an empty string."],
            maxLength: [10, "Row must be 10 characters or less."],
            required: [true, "Row is required."],
        },

        /**
         * Numeric seat position within the row.
         *
         * @remarks
         * - Required only when `layoutType === "SEAT"`
         * - Must be ≥ 1
         */
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

        /**
         * Optional display label for the seat.
         *
         * @remarks
         * - Only allowed for `SEAT` layout types
         * - Must be empty for non-seat layout entries
         */
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
            },
        },

        /**
         * Seat classification.
         *
         * @example "REGULAR"
         * @example "VIP"
         */
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

        /**
         * Layout role of this entry in the screen grid.
         *
         * @example "SEAT"
         * @example "AISLE"
         * @example "STAIR"
         */
        layoutType: {
            type: String,
            enum: SeatLayoutTypeConstant,
            default: SeatLayoutTypeConstant[0],
            required: [true, "Layout Type is required."],
        },

        /**
         * Indicates whether the seat is currently bookable.
         *
         * Only applicable to `SEAT` layout types.
         */
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

        /**
         * Horizontal grid coordinate of the seat.
         */
        x: {
            type: Number,
            min: [1, "X must be 1 or more."],
            required: [true, "X coordinate is required."],
            validate: {
                validator: Number.isInteger,
                message: "X must be an integer.",
            },
        },

        /**
         * Vertical grid coordinate of the seat.
         */
        y: {
            type: Number,
            min: [1, "Y must be 1 or more."],
            required: [true, "Y coordinate is required."],
            validate: {
                validator: Number.isInteger,
                message: "Y must be an integer.",
            },
        },

        /**
         * Price multiplier applied to the base ticket price.
         *
         * @remarks
         * - Defaults to `1.0`
         * - Only applicable to `SEAT` layout types
         */
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

        /**
         * URL-safe unique identifier for the seat.
         */
        slug: SlugSchemaTypeOptions,
    },
    {
        /**
         * Automatically manages timestamp fields.
         */
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
);

/**
 * Ensures seat uniqueness within a screen by row + seat number.
 */
SeatSchema.index(
    { theatre: 1, screen: 1, row: 1, seatNumber: 1 },
    { unique: true, partialFilterExpression: { seatNumber: { $exists: true } } },
);

/**
 * Ensures unique seat coordinates within a screen layout.
 */
SeatSchema.index(
    { theatre: 1, screen: 1, x: 1, y: 1 },
    { unique: true },
);
