import {Model, model, Schema,} from "mongoose";
import type IMovie from "./IMovie.js";
import {
    DeleteMovieQueryPostMiddleware, FindOneAndUpdateMovieQueryPostMiddleware, FindOneAndUpdateMovieQueryPreMiddleware
} from "./middleware/MovieQueryMiddleware.js";
import {
    DeleteOneMovieDocumentPreMiddleware,
    SaveMovieDocumentPostMiddleware, SaveMovieDocumentPreMiddleware
} from "./middleware/MovieDocumentMiddleware.js";

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
        default: new Date(),
        required: [true, "Release Date is required."],
    },

    durationInMinutes: {
        type: Number,
        min: [1, "Duration must be at least 1 minute."],
        required: [true, "Duration In Minutes is required."],
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
        min: [0, "Price must be 0 or greater."],
        required: [true, "Price is required."],
    },

    showings: {
        type: [{type: Schema.Types.ObjectId, ref: "Showing"}],
        required: true,
    },
}, {timestamps: true});

/**
 * Middleware
 */

MovieSchema.pre("save", {document: true, query: false}, SaveMovieDocumentPreMiddleware);
MovieSchema.post("save", {document: true, query: false}, SaveMovieDocumentPostMiddleware);

MovieSchema.pre("findOneAndUpdate", {document: false, query: true}, FindOneAndUpdateMovieQueryPreMiddleware);
MovieSchema.post("findOneAndUpdate", {document: false, query: true}, FindOneAndUpdateMovieQueryPostMiddleware);

MovieSchema.pre("deleteOne", {document: true, query: false}, DeleteOneMovieDocumentPreMiddleware);
MovieSchema.pre(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteMovieQueryPostMiddleware);

const Movie: Model<IMovie> = model<IMovie>("Movie", MovieSchema);
export default Movie;