/**
 * @file ReservedSeatSnapshot.schema.ts
 *
 * @description
 * Mongoose schema for an immutable reserved seat snapshot.
 *
 * Persists the finalized state of a single seat at reservation or showing
 * creation time, including its originating seat map reference, stable
 * identifier, classification, optional display label, and final price.
 *
 * This schema is embedded into higher-level snapshots (e.g. reserved showings)
 * to guarantee historical and financial integrity if seat layouts, metadata,
 * or pricing rules change after the reservation is created.
 */

import { Schema } from "mongoose";
import type { ReservedSeatSnapshotSchemaFields } from "./ReservedSeatSnapshot.types.js";
import SeatTypeConstant from "../../../seat/constant/SeatTypeConstant.js";

/**
 * Reserved seat snapshot schema.
 *
 * Represents a single seat exactly as it existed at snapshot time and must
 * not be mutated after creation.
 */
export const ReservedSeatSnapshotSchema = new Schema<ReservedSeatSnapshotSchemaFields>({
    /** Reference to the originating seat map entry. */
    seatMap: {
        type: Schema.Types.ObjectId,
        ref: "SeatMap",
        required: [true, "Seat Map is required."],
    },

    /** Stable identifier linking back to the original seat definition. */
    seatIdentifier: {
        type: String,
        minlength: [1, "Seat Identifier must not be an empty string."],
        maxLength: [20, "Seat Identifier must be 20 characters or less."],
        required: [true, "Seat Identifier is required."],
    },

    /** Logical seat classification (e.g. regular, VIP, disabled). */
    seatType: {
        type: String,
        enum: SeatTypeConstant,
        required: [true, "Seat Type is required."],
    },

    /** Optional human-readable seat label (e.g. \"A12\"). */
    seatLabel: {
        type: String,
        minlength: [1, "Seat Label must not be an empty string."],
        maxLength: [50, "Seat Label must be 50 characters or less."],
        trim: true,
    },

    /** Final price assigned to the seat at snapshot time. */
    pricePaid: {
        type: Number,
        validate: {
            message: "Price Paid must be more than 0.",
            validator: (val: unknown) =>
                val === null ||
                val === undefined ||
                (typeof val === "number" && val > 0),
        },
    },
});
