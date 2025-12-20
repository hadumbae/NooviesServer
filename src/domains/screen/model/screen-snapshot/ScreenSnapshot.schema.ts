/**
 * @file ScreenSnapshotSchema.ts
 *
 * @summary
 * Mongoose schema for a cinema screen snapshot.
 *
 * @description
 * Represents the state of a screen at a specific point in time,
 * such as when embedded in a theatre or showing document.
 * Validates essential screen properties:
 * - `name` (screen identifier)
 * - `screenType` (e.g., Standard, IMAX, 4DX)
 *
 * This schema is typically used as an embedded subdocument rather than
 * a top-level collection.
 */

import { Schema } from "mongoose";
import ScreenTypeConstant from "../../constant/ScreenTypeConstant.js";
import type { ScreenSnapshotSchemaFields } from "./ScreenSnapshot.types.js";

/**
 * Mongoose schema defining a screen snapshot with validation.
 *
 * @example
 * ```ts
 * const exampleScreen: ScreenSnapshotSchemaFields = {
 *   name: "Screen 1",
 *   screenType: "IMAX",
 * };
 * ```
 */
export const ScreenSnapshotSchema = new Schema<ScreenSnapshotSchemaFields>({
    name: {
        type: String,
        maxLength: [255, "Name must be 255 characters or less."],
        required: true,
    },
    screenType: {
        type: String,
        enum: ScreenTypeConstant,
        required: [true, "Screen Type is required."],
    }
});
