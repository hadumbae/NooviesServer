import {Model, model, Schema,} from "mongoose";
import type IMovie from "./IMovie.js";
import {
    DeleteMovieQueryPostMiddleware,
    DeleteOneMovieDocumentPostMiddleware,
    SaveMovieDocumentPostMiddleware
} from "./MovieMiddleware.js";

const MovieSchema = new Schema<IMovie>({
    title: {
        type: String,
        maxlength: [1000, "Title must be 1000 characters or less."],
        required: [true, "Title is required."],
    },

    description: {
        type: String,
        maxlength: [2000, "Description must be 2000 characters or less."],
        required: [true, "Description is required."],
    },

    genres: {
        type: [{type: Schema.Types.ObjectId, ref: "Genre"}],
        required: true,
    },

    directors: {
        type: [{type: Schema.Types.ObjectId, ref: "Person"}],
        required: true,
    },

    cast: {
        type: [{type: Schema.Types.ObjectId, ref: "Person"}],
        required: true,
    },

    releaseDate: {
        type: Date,
        required: false,
        default: null
    },

    durationInMinutes: {
        type: Number,
        required: [true, "Duration In Minutes is required."],
        min: [1, "Duration must be at least 1 minute."]
    },

    languages: {
        type: [String],
        required: true,
    },

    subtitles: {
        type: [String],
        required: true,
    },

    posterImage: {
        type: {public_id: String, secure_url: String},
        required: false,
        default: null,
    },

    trailerURL: {
        type: String,
        required: false,
        default: null,
    },

    price: {
        type: Number,
        required: [true, "Price is required."]
    },

    showings: {
        type: [{type: Schema.Types.ObjectId, ref: "Showing"}],
        required: true,
    },
}, {timestamps: true});

/**
 * Middleware
 */

MovieSchema.post("save", {document: true, query: false}, SaveMovieDocumentPostMiddleware);
MovieSchema.pre("deleteOne", {document: true, query: false}, DeleteOneMovieDocumentPostMiddleware);
MovieSchema.pre(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteMovieQueryPostMiddleware);

const Movie: Model<IMovie> = model<IMovie>("Movie", MovieSchema);
export default Movie;