/**
 * @fileoverview Mongoose schema definition for the Screen entity.
 * Defines the persistent data structure and validation rules for physical cinema auditoriums.
 */

import {Schema} from "mongoose";
import type {ScreenSchemaFields} from "./Screen.types";
import SlugSchemaTypeOptions from "@shared/model/SlugSchemaTypeOptions";
import {ScreenTypeConstant} from "@domains/screen/validation";

/**
 * Mongoose schema for a Screen.
 */
export const ScreenSchema = new Schema<ScreenSchemaFields>(
    {
        name: {
            type: String,
            trim: true,
            maxLength: [255, "Name must be 255 characters or less."],
            required: [true, "Screen name is required."],
        },

        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: [true, "Theatre is required."],
            index: true,
        },

        capacity: {
            type: Number,
            min: [1, "Capacity must be at least 1."],
            required: [true, "Capacity is required."],
        },

        screenType: {
            type: String,
            enum: {
                values: ScreenTypeConstant,
                message: "{VALUE} is not a supported Screen Type.",
            },
            default: "2D",
            required: [true, "Screen Type is required."],
        },

        slug: SlugSchemaTypeOptions,
    },
    {
        timestamps: true,
    },
);