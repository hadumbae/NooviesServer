import {model, type Model, Schema} from "mongoose";
import type {IPerson} from "./PersonInterfaces.js";

// TODO Add Awards and Nominations

const PersonSchema = new Schema<IPerson>({
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
        type: Date,
        required: [true, "Date Of Birth is required."],
    },

    nationality: {
        type: String,
        required: [true, "Nationality is required."],
        default: null,
    },

    profileImage: {
        type: { public_id: String, secure_url: String },
        required: false,
        default: null,
    },

    movies: {
        type: [Schema.Types.ObjectId],
        ref: "Movie",
        required: true,
    },
}, {timestamps: true});

const Person: Model<IPerson> = model<IPerson>("Person", PersonSchema);
export default Person;