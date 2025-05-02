import {Model, model, Schema} from "mongoose";
import type IGenre from "./IGenre.js";
import {DeleteGenreDocumentPreMiddleware} from "./middleware/GenreDocumentMiddleware.js";
import {DeleteGenreQueryPreMiddleware} from "./middleware/GenreQueryMiddleware.js";

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
        required: [true, "Movie array is required."],
    },
}, {timestamps: true});

GenreSchema.pre("deleteOne", {document: true, query: false}, DeleteGenreDocumentPreMiddleware);
GenreSchema.pre(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteGenreQueryPreMiddleware);

const Genre: Model<IGenre> = model<IGenre>("Genre", GenreSchema);
export default Genre;