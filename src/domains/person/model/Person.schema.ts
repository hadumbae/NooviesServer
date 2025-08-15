import {Schema} from "mongoose";
import type {IPerson} from "../interfaces/IPerson.js";
import {CloudinaryImageSchema} from "../../../shared/model/cloudinary-image/CloudinaryImage.js";

export const PersonSchema = new Schema<IPerson>({
    name: {
        type: String,
        required: [true, "Name is required."],
        minlength: [3, "Name must be 3 or more characters."],
        maxlength: [255, "Name must be 255 characters or less."],
    },

    biography: {
        type: String,
        required: [true, "Biography is required."],
        maxlength: [2000, "Name must be 2000 characters or less."],
    },

    dob: {
        type: String,
        required: [true, "Date Of Birth is required."],
        match: [/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format."]
    },

    nationality: {
        type: String,
        required: [true, "Nationality is required."],
        default: null,
    },

    profileImage: {
        type: CloudinaryImageSchema,
        required: false,
        default: null,
    },
}, {timestamps: true});