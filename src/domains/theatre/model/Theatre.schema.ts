import {Schema} from "mongoose";
import {LocationSchema} from "../../../shared/model/location/Location.js";
import type {TheatreSchemaFields} from "./Theatre.types.js";

/**
 * ⚡ @file TheatreSchema.ts
 *
 * Mongoose schema definition for the **Theatre** domain entity.
 *
 * Represents a physical theatre location, including:
 * - Human-readable name
 * - Total seat capacity
 * - Geographical / address location
 *
 * Automatically manages `createdAt` and `updatedAt` timestamps.
 */
export const TheatreSchema = new Schema<TheatreSchemaFields>({
    /**
     * ⚡ Theatre display name.
     *
     * - Trimmed for safety
     * - Required
     * - Maximum length: 255 characters
     */
    name: {
        type: String,
        trim: true,
        maxlength: [255, "Name must be 255 characters or less."],
        required: [true, "Name is required"],
    },

    /**
     * ⚡ Total seating capacity of the theatre.
     *
     * - Defaults to `0`
     * - Must be an integer
     */
    seatCapacity: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: "Seat Capacity must be an integer",
        },
    },

    /**
     * ⚡ Physical location of the theatre.
     *
     * Embedded {@link LocationSchema}.
     * Required for all theatres.
     */
    location: {
        type: LocationSchema,
        required: [true, "Location is required."],
    },
}, {
    timestamps: true,
});
