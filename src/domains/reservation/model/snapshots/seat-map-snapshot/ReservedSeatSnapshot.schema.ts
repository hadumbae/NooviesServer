/**
 * @file ReservedSeatSnapshot.schema.ts
 *
 * @description
 * Mongoose schema for an immutable reserved seat snapshot.
 *
 * Captures the identity, classification, label, and final pricing of a seat at
 * reservation or showing creation time. This ensures historical integrity if
 * the underlying seat map or pricing rules change later.
 */

import { Schema } from "mongoose";
import type { ReservedSeatSnapshotSchemaFields } from "./ReservedSeatSnapshot.types.js";
import SeatTypeConstant from "../../../../seat/constant/SeatTypeConstant.js";

/**
 * Reserved seat snapshot schema.
 */
export const ReservedSeatSnapshotSchema = new Schema<ReservedSeatSnapshotSchemaFields>({
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
