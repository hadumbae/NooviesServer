import { Schema } from "mongoose";
import { LocationSchema } from "../../../shared/model/location/Location.js";
import type { TheatreSchemaFields } from "./Theatre.types.js";
import SlugSchemaTypeOptions from "../../../shared/model/SlugSchemaTypeOptions.js";

/**
 * @file TheatreSchema.ts
 *
 * @summary
 * Mongoose schema definition for Theatre documents.
 *
 * @description
 * Represents a physical cinema theatre, including its identifying name,
 * seating capacity, location metadata, and URL-safe slug.
 *
 * Automatically manages `createdAt` and `updatedAt` timestamps.
 */
export const TheatreSchema = new Schema<TheatreSchemaFields>(
    {
        /**
         * Human-readable display name of the theatre.
         *
         * - Required
         * - Trimmed
         * - Max length: 255 characters
         */
        name: {
            type: String,
            trim: true,
            maxlength: [255, "Name must be 255 characters or less."],
            required: [true, "Name is required"],
        },

        /**
         * Total seating capacity of the theatre.
         *
         * - Defaults to `0`
         * - Must be an integer
         */
        seatCapacity: {
            type: Number,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: "Seat capacity must be an integer",
            },
        },

        /**
         * URL-safe unique identifier for routing and lookups.
         */
        slug: SlugSchemaTypeOptions,

        /**
         * Physical location information for the theatre.
         *
         * Embedded {@link LocationSchema}.
         * Required for all theatre documents.
         */
        location: {
            type: LocationSchema,
            required: [true, "Location is required."],
        },
    },
    {
        timestamps: true,
    }
);
