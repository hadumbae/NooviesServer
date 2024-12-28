import {Model, model, Schema} from "mongoose";
import type {IGenre} from "./GenreInterfaces.js";

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
    movies: {
        type: [{type: Schema.Types.ObjectId, ref: "Movie"}],
        required: true,
    },
}, {timestamps: true});

const Genre: Model<IGenre> = model<IGenre>("Genre", GenreSchema);
export default Genre;