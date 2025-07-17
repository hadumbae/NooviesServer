import {Schema} from "mongoose";
import type ICoordinate from "./ICoordinate.js";

/**
 * Mongoose schema for a GeoJSON Point coordinate,
 * representing a single geographic location.
 */
export const CoordinateSchema = new Schema<ICoordinate>({
    /**
     * The GeoJSON geometry type.
     * Always set to the literal string "Point" and immutable once created.
     */
    type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        immutable: true,
    },

    /**
     * The coordinate pair as [longitude, latitude].
     * - Must be an array of exactly two numbers.
     * - Longitude (first element) must be between -180 and 180.
     * - Latitude (second element) must be between -90 and 90.
     */
    coordinates: {
        type: [Number],
        required: [true, "Coordinate points are required."],
        validate: {
            validator: (value: unknown) => {
                if (!Array.isArray(value) || value.length !== 2) return false;
                const [lng, lat] = value as number[];
                if (typeof lng !== "number" || typeof lat !== "number") return false;
                return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
            },
            message: (props: any) => `Invalid coordinates. Received: ${props.value}`,
        },
    },
});