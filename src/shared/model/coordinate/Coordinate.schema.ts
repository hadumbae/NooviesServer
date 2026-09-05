/**
 * @fileoverview Mongoose schema definition for GeoJSON Point coordinate geometry structures.
 */

import {Schema} from "mongoose";
import type {CoordinateSchemaFields} from "@/shared/model/coordinate/Coordinate.types";

/** Mongoose schema representing a GeoJSON Point coordinate object. */
export const CoordinateSchema = new Schema<CoordinateSchemaFields>({
    type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        immutable: true,
    },

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