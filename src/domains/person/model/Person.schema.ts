/**
 * @file Person.schema.ts
 *
 * Mongoose schema definition for people involved in movies,
 * including cast and crew members.
 */

import {Schema} from "mongoose";
import type {PersonSchemaFields} from "../interfaces/PersonSchemaFields.js";
import {CloudinaryImageSchema} from "../../../shared/model/cloudinary-image/CloudinaryImage.js";
import ISO3166Alpha2CodeConstant from "../../../shared/constants/country/ISO3166Alpha2CodeConstant.js";
import SlugSchemaTypeOptions from "../../../shared/model/SlugSchemaTypeOptions.js";

/**
 * Person schema.
 *
 * Stores core identity, biography, nationality,
 * optional profile image, and a generated slug.
 */
export const PersonSchema = new Schema<PersonSchemaFields>(
    {
        /**
         * Full name of the person.
         */
        name: {
            type: String,
            trim: true,
            required: [true, "Name is required."],
            minlength: [3, "Name must be 3 or more characters."],
            maxlength: [255, "Name must be 255 characters or less."],
        },

        /**
         * Short biography.
         */
        biography: {
            type: String,
            trim: true,
            required: [true, "Biography is required."],
            minlength: [1, "Must not be an empty string."],
            maxlength: [2000, "Biography must be 2000 characters or less."],
        },

        /**
         * Date of birth.
         * Must not be in the future.
         */
        dob: {
            type: Date,
            required: [true, "Date Of Birth is required."],
            validate: {
                validator: (birthDate) =>
                    birthDate instanceof Date && birthDate <= new Date(),
                message: "DoB must not be in the future.",
            },
        },

        /**
         * Nationality (ISO 3166-1 alpha-2).
         */
        nationality: {
            type: String,
            enum: {
                values: ISO3166Alpha2CodeConstant,
                message: "Must be a valid ISO 3166-1 alpha-2 code.",
            },
            required: [true, "Nationality is required."],
        },

        /**
         * Optional profile image stored in Cloudinary.
         */
        profileImage: {
            type: CloudinaryImageSchema,
        },

        /**
         * URL-friendly identifier generated from the name.
         */
        slug: SlugSchemaTypeOptions,
    },
    {timestamps: true},
);

/**
 * Case-insensitive index for name lookups.
 */
PersonSchema.index(
    {name: 1},
    {collation: {locale: "en", strength: 2}},
);

/**
 * Index for filtering or sorting by nationality.
 */
PersonSchema.index({nationality: 1});
