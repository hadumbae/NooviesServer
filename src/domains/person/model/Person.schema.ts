/**
 * @fileoverview Mongoose schema definition for the Person collection.
 * Defines identity, biography, and nationality for cast and crew members.
 */

import {Schema} from "mongoose";
import type {PersonSchemaFields} from "./Person.types";
import {CloudinaryImageSchema} from "@shared/model/cloudinary-image/CloudinaryImage";
import ISO3166Alpha2CodeConstant from "../../../shared/constants/country/ISO3166Alpha2CodeConstant.js";
import SlugSchemaTypeOptions from "../../../shared/model/SlugSchemaTypeOptions.js";

/**
 * Stores core identity, birth data, and media assets for people in the movie domain.
 */
export const PersonSchema = new Schema<PersonSchemaFields>(
    {
        /** Full name with length constraints. */
        name: {
            type: String,
            trim: true,
            required: [true, "Name is required."],
            minlength: [3, "Name must be 3 or more characters."],
            maxlength: [255, "Name must be 255 characters or less."],
        },

        /** Biography limited to 2000 characters. */
        biography: {
            type: String,
            trim: true,
            required: [true, "Biography is required."],
            maxlength: [2000, "Biography must be 2000 characters or less."],
        },

        /** Date of birth with future-date validation. */
        dob: {
            type: Date,
            required: [true, "Date Of Birth is required."],
            validate: {
                validator: (date: Date) => date <= new Date(),
                message: "DoB must not be in the future.",
            },
        },

        /** ISO 3166-1 alpha-2 country code. */
        nationality: {
            type: String,
            enum: {
                values: ISO3166Alpha2CodeConstant,
                message: "Must be a valid ISO 3166-1 alpha-2 code.",
            },
            required: [true, "Nationality is required."],
        },

        /** Optional profile image asset. */
        profileImage: {
            type: CloudinaryImageSchema,
            default: null,
        },

        /** URL-friendly unique identifier. */
        slug: SlugSchemaTypeOptions,
    },
    {timestamps: true},
);