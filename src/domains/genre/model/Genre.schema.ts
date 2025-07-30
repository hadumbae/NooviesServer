import {Schema} from "mongoose";
import type IGenre from "./Genre.interface.js";

const GenreSchema = new Schema<IGenre>({
    name: {
        type: String,
        required: [true, "Name is required."],
        unique: [true, "Name must be unique."],
    },

    description: {
        type: String,
        required: [true, "Description is required."],
        maxlength: [1000, "Description must be 1000 characters or less."],
    },
}, {timestamps: true});

export default GenreSchema;