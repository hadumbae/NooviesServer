/**
 * @fileoverview Mongoose schema definition for immutable Screen snapshots.
 * Designed for use as a subdocument to preserve the state of an auditorium
 * within historical records like Showings or Reservations.
 */

import {Schema} from "mongoose";
import type {ScreenSnapshotSchemaFields} from "./ScreenSnapshot.types.js";
import {ScreenTypeConstant} from "@domains/screen/validation";

/**
 * Mongoose schema for a Screen snapshot.
 */
export const ScreenSnapshotSchema = new Schema<ScreenSnapshotSchemaFields>({
    theatre: {
        type: Schema.Types.ObjectId,
        ref: "Theatre",
        required: [true, "Theatre is required."],
    },

    name: {
        type: String,
        maxLength: [255, "Name must be 255 characters or less."],
        required: [true, "Screen name is required for snapshots."],
    },

    screenType: {
        type: String,
        enum: {
            values: ScreenTypeConstant,
            message: "{VALUE} is not a valid Screen Type.",
        },
        required: [true, "Screen Type is required."],
    },
}, {_id: false, timestamps: false});