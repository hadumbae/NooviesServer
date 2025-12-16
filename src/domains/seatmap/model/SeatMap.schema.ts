/**
 * @file SeatMapSchema.ts
 * @summary
 * Mongoose schema defining the mapping between a seat and a showing.
 *
 * Acts as a join-table between `Showing` and `Seat`, enforcing unique
 * `(showing, seat)` pairs while tracking price data and availability state.
 *
 * @example
 * import SeatMapModel from "@/models/SeatMap";
 *
 * const seats = await SeatMapModel.find({
 *   showing: showingId,
 *   status: "AVAILABLE",
 * });
 */

import {Schema} from "mongoose";
import SeatMapStatusConstant from "../constants/SeatMapStatusConstant.js";
import type {SeatMapSchemaFields} from "./SeatMap.types.js";

/**
 * @summary
 * Schema describing the relationship between a `Showing` and a `Seat`,
 * including pricing fields and seat availability.
 */
export const SeatMapSchema = new Schema<SeatMapSchemaFields>({
    /** Reference to the showing (`Showing`). */
    showing: {
        type: Schema.Types.ObjectId,
        ref: "Showing",
        required: [true, "Showing is required."],
    },

    /** Reference to the seat (`Seat`). */
    seat: {
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: [true, "Seat is required."],
    },

    /** Base price for the seat during the showing. */
    basePrice: {
        type: Number,
        required: [true, "Base Price is required."],
        validate: {
            message: "Base Price must be more than 0.",
            validator: (val: number) => val > 0,
        },
    },

    /** Multiplier applied to the base price. Must be > 0. */
    priceMultiplier: {
        type: Number,
        required: [true, "Price Multiplier is required."],
        validate: {
            message: "Price Multiplier must be more than 0.",
            validator: (val: number) => val > 0,
        },
    },

    /** Optional explicit price override, must be > 0 if provided. */
    overridePrice: {
        type: Number,
        validate: {
            message: "Override Price must be more than 0.",
            validator: (val: any) =>
                val === null || val === undefined || (typeof val === "number" && val > 0),
        },
    },

    /**
     * Status of the seat during the showing.
     *
     * @default "AVAILABLE"
     * @see SeatMapStatusConstant
     */
    status: {
        type: String,
        enum: {
            values: SeatMapStatusConstant,
            message: `Invalid Seat Map Status. Must be: ${SeatMapStatusConstant.join(", ")}`,
        },
        required: [true, "Status is required."],
        default: "AVAILABLE",
    },
});

/** Enforce uniqueness of `(showing, seat)` pairs. */
SeatMapSchema.index(
    {showing: 1, seat: 1},
    {unique: true, partialFilterExpression: {seat: {$exists: true}}},
);

/** Index optimized for availability queries. */
SeatMapSchema.index({showing: 1, status: 1});
