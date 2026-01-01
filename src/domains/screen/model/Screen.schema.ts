/**
 * @file Screen.schema.ts
 *
 * @summary
 * Mongoose schema definition for cinema screens.
 *
 * @description
 * Defines the persistent data structure for a theatre screen,
 * including validation rules, defaults, and relationships
 * to its parent theatre.
 */

import { Schema } from "mongoose";
import type { ScreenSchemaFields } from "./Screen.types.js";
import ScreenTypeConstant from "../constant/ScreenTypeConstant.js";
import SlugSchemaTypeOptions from "../../../shared/model/SlugSchemaTypeOptions.js";

/**
 * @summary
 * Screen persistence schema.
 *
 * @description
 * Represents a physical screening room within a theatre.
 * Enforces:
 * - Capacity constraints
 * - Screen technology validation
 * - Theatre ownership
 *
 * Automatically manages `createdAt` and `updatedAt` timestamps.
 */
export const ScreenSchema = new Schema<ScreenSchemaFields>(
    {
        /**
         * Human-readable name of the screen.
         *
         * @remarks
         * - Required
         * - Maximum length: 255 characters
         */
        name: {
            type: String,
            maxLength: [255, "Name must be 255 characters or less."],
            required: true,
        },

        /**
         * Theatre this screen belongs to.
         *
         * Stored as a reference to the `Theatre` collection.
         */
        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: [true, "Theatre is required."],
        },

        /**
         * Total seating capacity of the screen.
         *
         * @remarks
         * - Must be greater than zero
         * - Required
         */
        capacity: {
            type: Number,
            gt: [0, "Capacity must be greater than 0."],
            required: [true, "Capacity is required."],
        },

        /**
         * Screen technology or projection format.
         *
         * @example "2D"
         * @example "IMAX"
         * @example "3D"
         */
        screenType: {
            type: String,
            enum: ScreenTypeConstant,
            default: "2D",
            required: [true, "Screen Type is required."],
        },

        /**
         * URL-safe unique identifier for routing and lookups.
         */
        slug: SlugSchemaTypeOptions,
    },
    {
        /**
         * Automatically manages `createdAt` and `updatedAt` fields.
         */
        timestamps: true,
    },
);
