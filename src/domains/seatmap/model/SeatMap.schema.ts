/**
 * @file SeatMap.schema.ts
 *
 * Mongoose schema defining the relationship between a `Showing` and a `Seat`.
 *
 * Acts as a join entity enforcing unique `(showing, seat)` pairs while
 * tracking pricing configuration, availability state, and reservation linkage.
 *
 * This schema represents the **live, mutable state** of a seat within the
 * context of a specific showing.
 *
 * @remarks
 * For historical or transactional use (e.g. reservations, tickets),
 * immutable snapshot data should be used to prevent drift.
 *
 * @example
 * const seats = await SeatMapModel.find({
 *   showing: showingId,
 *   status: "AVAILABLE",
 * });
 */

import { Schema } from "mongoose";
import SeatMapStatusConstant from "../constants/SeatMapStatusConstant.js";
import type { SeatMapSchemaFields } from "./SeatMap.types.js";

/**
 * Schema describing a seat’s configuration and availability
 * for a specific showing.
 */
export const SeatMapSchema = new Schema<SeatMapSchemaFields>({
    /** Referenced showing (`Showing`). */
    showing: {
        type: Schema.Types.ObjectId,
        ref: "Showing",
        required: [true, "Showing is required."],
    },

    /** Referenced seat (`Seat`). */
    seat: {
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: [true, "Seat is required."],
    },

    /**
     * Associated reservation.
     *
     * @remarks
     * Required when the seat is reserved or sold.
     */
    reservation: {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
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

    /**
     * Multiplier applied to the base price.
     *
     * @remarks
     * Must be greater than zero.
     */
    priceMultiplier: {
        type: Number,
        required: [true, "Price Multiplier is required."],
        validate: {
            message: "Price Multiplier must be more than 0.",
            validator: (val: number) => val > 0,
        },
    },

    /**
     * Optional explicit price override.
     *
     * @remarks
     * When provided, this value replaces computed pricing.
     */
    overridePrice: {
        type: Number,
        validate: {
            message: "Override Price must be more than 0.",
            validator: (val: any) =>
                val === null ||
                val === undefined ||
                (typeof val === "number" && val > 0),
        },
    },

    /**
     * Availability state of the seat for the showing.
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

/** Enforces uniqueness of `(showing, seat)` pairs. */
SeatMapSchema.index(
    { showing: 1, seat: 1 },
    { unique: true, partialFilterExpression: { seat: { $exists: true } } }
);

/** Index optimized for seat availability queries per showing. */
SeatMapSchema.index({ showing: 1, status: 1 });
