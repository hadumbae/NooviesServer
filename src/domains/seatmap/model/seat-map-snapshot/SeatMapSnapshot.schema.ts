/**
 * @file SeatMapSnapshot.schema.ts
 *
 * @description
 * Mongoose schema defining an immutable snapshot of a seat within a seat map.
 * Captures seat identity, classification, label, and pricing at the time of
 * snapshot creation to prevent drift from later seat map changes.
 */

import { Schema } from "mongoose";
import type { SeatMapSnapshotSchemaFields } from "./SeatMapSnapshot.types.js";
import SeatTypeConstant from "../../../seat/constant/SeatTypeConstant.js";

/**
 * Seat map snapshot schema.
 */
export const SeatMapSnapshotSchema = new Schema<SeatMapSnapshotSchemaFields>({
    seatIdentifier: {
        type: String,
        minlength: [1, "Seat Identifier must not be an empty string."],
        maxLength: [20, "Seat Identifier must be 20 characters or less."],
        required: [true, "Seat Identifier is required."],
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

    price: {
        type: Number,
        validate: {
            message: "Price must be more than 0.",
            validator: (val: any) =>
                val === null ||
                val === undefined ||
                (typeof val === "number" && val > 0),
        },
    },
});
