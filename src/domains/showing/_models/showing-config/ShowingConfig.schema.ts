/**
 * @fileoverview Defines the Mongoose schema for showing configuration settings.
 */

import {Schema} from "mongoose";
import type {ShowingConfigSchemaFields} from "@/domains/showing/_models/showing-config/ShowingConfig.types.js";

/** Mongoose schema for the ShowingConfig model. */
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