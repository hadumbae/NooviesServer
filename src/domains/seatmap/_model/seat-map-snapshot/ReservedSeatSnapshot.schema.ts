/**
 * @fileoverview Mongoose schema definition for snapshots of reserved seats within a seat map.
 */

import {Schema} from "mongoose";
import {SeatTypeConstant} from "@/domains/seat/_validation";
import type {
    ReservedSeatSnapshotSchemaFields
} from "@/domains/seatmap/_model/seat-map-snapshot/ReservedSeatSnapshot.types.js";

/** Mongoose schema for the ReservedSeatSnapshot model. */
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
