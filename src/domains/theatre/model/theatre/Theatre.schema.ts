/**
 * @fileoverview Mongoose schema definition for the Theatre entity.
 * Serves as the primary data structure for physical cinema locations,
 * integrating branding, capacity, and geospatial data.
 */

import {Schema} from "mongoose";
import {LocationSchema} from "@shared/model/location/Location";
import type {TheatreSchemaFields} from "./Theatre.types";
import SlugSchemaTypeOptions from "@shared/model/SlugSchemaTypeOptions";

/**
 * Mongoose schema for a Theatre.
 */
export const TheatreSchema = new Schema<TheatreSchemaFields>(
    {
        name: {
            type: String,
            trim: true,
            maxlength: [255, "Name must be 255 characters or less."],
            required: [true, "Theatre name is required."],
        },

        seatCapacity: {
            type: Number,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: "Seat capacity must be a whole number.",
            },
        },

        slug: SlugSchemaTypeOptions,

        location: {
            type: LocationSchema,
            required: [true, "Physical location metadata is required."],
        },
    },
    {
        timestamps: true,
    }
);