/**
 * @file Screen.schema.ts
 *
 * @summary
 * Mongoose schema definition for cinema screens.
 *
 * @description
 * Defines the persistent data structure for a theatre screen,
 * including validation rules, defaults, and relationships.
 */

import { Schema } from "mongoose";
import type { ScreenSchemaFields } from "./Screen.types.js";
import ScreenTypeConstant from "../constant/ScreenTypeConstant.js";

/**
 * @summary
 * Screen persistence schema.
 *
 * @description
 * Represents a physical screening room within a theatre,
 * enforcing capacity constraints and screen type validation.
 */
export const ScreenSchema = new Schema<ScreenSchemaFields>(
    {
        /** Human-readable screen name. */
        name: {
            type: String,
            maxLength: [255, "Name must be 255 characters or less."],
            required: true,
        },

        /**
         * Theatre this screen belongs to.
         * Stored as a reference to the Theatre collection.
         */
        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: [true, "Theatre is required."],
        },

        /** Seating capacity of the screen. */
        capacity: {
            type: Number,
            gt: [0, "Capacity must be greater than 0."],
            required: [true, "Capacity is required."],
        },

        /** Screen technology or format. */
        screenType: {
            type: String,
            enum: ScreenTypeConstant,
            default: "2D",
            required: [true, "Screen Type is required."],
        },
    },
    {
        /** Automatically manages createdAt and updatedAt fields. */
        timestamps: true,
    },
);
