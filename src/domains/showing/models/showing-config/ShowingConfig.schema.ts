/**
 * @file Mongoose schema for showing configuration.
 * @filename ShowingConfig.schema.ts
 */

import {Schema} from "mongoose";
import type {ShowingConfigSchemaFields} from "./ShowingConfig.types.js";

/**
 * Configuration flags for a showing.
 */
export const ShowingConfigSchema = new Schema<ShowingConfigSchemaFields>({
    /** Enables seat reservations. Defaults to `false`. */
    canReserveSeats: {
        type: Boolean,
        default: false,
    },

    /** Marks special screenings. */
    isSpecialEvent: {
        type: Boolean,
        default: false,
        required: true,
    },

    /** Controls whether the showing is active. */
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },
});