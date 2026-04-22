/**
 * @fileoverview Mongoose schema for capturing a theatre's state at a specific point in time.
 */

import { Schema } from "mongoose";
import type { TheatreSnapshotSchemaFields } from "./TheatreSnapshot.types.js";
import ISO3166Alpha2CodeConstant from "../../../../shared/constants/country/ISO3166Alpha2CodeConstant.js";
import { IANAZone } from "luxon";

/**
 * Defines validation and structure for theatre data embedded within historical records like showings and reservations.
 */
export const TheatreSnapshotSchema = new Schema<TheatreSnapshotSchemaFields>({
    name: {
        type: String,
        trim: true,
        maxlength: [255, "Name must be 255 characters or less."],
        required: [true, "Name is required"],
    },

    street: {
        type: String,
        trim: true,
        maxlength: [2000, "`Street` must be 2000 letters or less."],
    },

    city: {
        type: String,
        trim: true,
        maxlength: [500, "`City` must be 500 letters or less."],
        required: [true, "`City` is required."],
    },

    state: {
        type: String,
        trim: true,
        maxlength: [500, "`State` must be 500 letters or less."],
    },

    country: {
        type: String,
        enum: ISO3166Alpha2CodeConstant,
        required: [true, "`Country` is required."],
    },

    postalCode: {
        type: String,
        trim: true,
        maxlength: [100, "`Postal Code` must be 100 letters or less."],
    },

    timezone: {
        type: String,
        required: [true, "`Timezone` is required."],
        validate: {
            validator: (value: any) => IANAZone.isValidZone(value),
            message: (props: any) => `Invalid timezone. Received: ${props.value}`,
        },
    },
});