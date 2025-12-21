/**
 * @file ScreenSnapshot.schema.ts
 *
 * @description
 * Mongoose schema for an immutable cinema screen snapshot.
 *
 * Captures the state of a screen at a specific point in time for embedding in
 * snapshot-based documents (e.g. theatres, showings). This prevents historical
 * drift if the source screen configuration changes later.
 *
 * Typically used as an embedded subdocument rather than a top-level collection.
 */

import { Schema } from "mongoose";
import ScreenTypeConstant from "../../constant/ScreenTypeConstant.js";
import type { ScreenSnapshotSchemaFields } from "./ScreenSnapshot.types.js";

/**
 * Screen snapshot schema.
 *
 * Stores the owning theatre reference and immutable screen properties such as
 * name and screen type.
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
        required: true,
    },

    screenType: {
        type: String,
        enum: ScreenTypeConstant,
        required: [true, "Screen Type is required."],
    },
});
