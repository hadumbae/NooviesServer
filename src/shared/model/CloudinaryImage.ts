import {Schema} from "mongoose";
import type ICloudinaryImage from "../interfaces/ICloudinaryImage.js";
import {ValidURLStringSchema} from "../schema/helpers/ZodStringHelpers.js";

export const CloudinaryImageSchema = new Schema<ICloudinaryImage>({
    public_id: {
        type: String,
        minlength: [1, "Empty strings are not allowed."],
        required: [true, "Required."]
    },

    secure_url: {
        type: String,
        minlength: [1, "Empty strings are not allowed."],
        required: [true, "Required."],
        validate: {
            validator: (v: any) => ValidURLStringSchema.safeParse(v).success,
            message: (props) => `"${props.value}" is not a valid URL.`,
        }
    },

    version: {
        type: Number,
        min: [1, "Must be a positive number."],
        required: [true, "Required."],
    },

    width: {
        type: Number,
        min: [0, "Must be 0 or more."],
        required: [true, "Required."],
    },

    height: {
        type: Number,
        min: [0, "Must be 0 or more."],
        required: [true, "Required."],
    },

    format: {
        type: String,
        minlength: [1, "Empty strings are not allowed."],
        required: [true, "Required."],
    },

    resource_type: {
        type: String,
        minlength: [1, "Empty strings are not allowed."],
        required: [true, "Required."],
    },

    bytes: {
        type: Number,
        min: [0, "Must be 0 or more."],
        required: [true, "Required."],
    },

    type: {
        type: String,
        minlength: [1, "Empty strings are not allowed."],
        required: [true, "Required."],
    },

    etag: {
        type: String,
        required: [true, "Required."],
    },

    url: {
        type: String,
        minlength: [1, "Empty strings are not allowed."],
        required: [true, "Required."],
        validate: {
            validator: (v: any) => ValidURLStringSchema.safeParse(v).success,
            message: (props) => `"${props.value}" is not a valid URL.`,
        }
    },

    signature: {
        type: String,
        minlength: [1, "Empty strings are not allowed."],
        required: [true, "Required."],
    },
});