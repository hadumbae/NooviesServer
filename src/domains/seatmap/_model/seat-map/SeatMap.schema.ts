/**
 * @fileoverview Defines the Mongoose schema for the SeatMap model.
 */

import { Schema } from "mongoose";
import {SeatMapStatusConstant} from "@/domains/seatmap/_validation/fields/SeatMapStatusConstant";
import type { SeatMapSchemaFields } from "@/domains/seatmap/_model/seat-map/SeatMap.types.js";

/** Mongoose schema definition for seat map entries. */
export const SeatMapSchema = new Schema<SeatMapSchemaFields>({
    showing: {
        type: Schema.Types.ObjectId,
        ref: "Showing",
        required: [true, "Showing is required."],
    },

    seat: {
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: [true, "Seat is required."],
    },

    reservation: {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
    },

    basePrice: {
        type: Number,
        required: [true, "Base Price is required."],
        validate: {
            message: "Base Price must be more than 0.",
            validator: (val: number) => val > 0,
        },
    },

    priceMultiplier: {
        type: Number,
        required: [true, "Price Multiplier is required."],
        validate: {
            message: "Price Multiplier must be more than 0.",
            validator: (val: number) => val > 0,
        },
    },

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

SeatMapSchema.index(
    { showing: 1, seat: 1 },
    { unique: true, partialFilterExpression: { seat: { $exists: true } } }
);

SeatMapSchema.index({ showing: 1, status: 1 });
