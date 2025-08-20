import {Schema} from "mongoose";
import type {IPerson} from "../interfaces/IPerson.js";
import {CloudinaryImageSchema} from "../../../shared/model/cloudinary-image/CloudinaryImage.js";
import ISO3166Alpha2CodeConstant from "../../../shared/constants/country/ISO3166Alpha2CodeConstant.js";

/**
 * Mongoose schema for storing information about a person involved in movies.
 * Includes cast and crew members.
 */
export const PersonSchema = new Schema<IPerson>({
    /**
     * Full name of the person.
     * - Required
     * - Trimmed of whitespace
     * - Length between 3 and 255 characters
     */
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required."],
        minlength: [3, "Name must be 3 or more characters."],
        maxlength: [255, "Name must be 255 characters or less."],
    },

    /**
     * Short biography of the person.
     * - Required
     * - Trimmed of whitespace
     * - Length between 3 and 2000 characters
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
     * - Required
     * - Must not be in the future
     */
    dob: {
        type: Date,
        required: [true, "Date Of Birth is required."],
        validate: {
            validator: (birthDate) => birthDate instanceof Date && birthDate <= new Date(),
            message: "DoB must not be in the future."
        }
    },

    /**
     * Nationality of the person.
     * - Required
     * - Must be a valid ISO 3166-1 alpha-2 country code
     */
    nationality: {
        type: String,
        enum: { values: ISO3166Alpha2CodeConstant, message: "Must be a valid ISO 3166-1 alpha-2 code." },
        required: [true, "Nationality is required."],
    },

    /**
     * Profile image stored in Cloudinary.
     * - Optional
     */
    profileImage: {
        type: CloudinaryImageSchema,
    },
}, { timestamps: true });

/**
 * Index to optimize searching by name (case-insensitive).
 */
PersonSchema.index({ name: 1 }, { collation: { locale: 'en', strength: 2 } });

/**
 * Index to optimize filtering or sorting by nationality.
 */
PersonSchema.index({ nationality: 1 });