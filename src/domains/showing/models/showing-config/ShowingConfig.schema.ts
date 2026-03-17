/**
 * @file Mongoose schema for showing configuration.
 * @filename ShowingConfig.schema.ts
 */

import {Schema} from "mongoose";
import type {ShowingConfigSchemaFields} from "./ShowingConfig.types.js";

/**
 * Showing-level configuration flags affecting runtime behaviour.
 */
export const ShowingConfigSchema = new Schema<ShowingConfigSchemaFields>({
    /** Whether the showing is active and bookable. */
    isActive: {
        type: Boolean,
        required: [true, "Is Active is required."],
    },

    /** Enables seat reservations. */
    canReserveSeats: {
        type: Boolean,
        default: false,
    },

    /** Marks special screenings (e.g. premieres). */
    isSpecialEvent: {
        type: Boolean,
        default: false,
    },
});