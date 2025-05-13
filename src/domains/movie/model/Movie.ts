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
        maxlength: [1000, "Must be 1000 characters or less."],
        required: [true, "Required."],
    },

    originalTitle: {
        type: String,
        maxlength: [1000, "Must be 1000 characters or less."],
        required: [true, "Required."],
    },

    tagline: {
        type: String,
        maxlength: [100, "Must be 100 characters or less."],
    },

    synopsis: {
        type: String,
        maxlength: [2000, "Must be 2000 characters or less."],
        required: [true, "Required."],
    },

    genres: {
        type: [{type: Schema.Types.ObjectId, ref: "Genre"}],
        required: true,
    },

    staff: {
        type: [{type: Schema.Types.ObjectId, ref: "Person"}],
        required: true,
    },

    cast: {
        type: [{type: Schema.Types.ObjectId, ref: "Person"}],
        required: true,
    },

    releaseDate: {
        type: String,
    },

    runtime: {
        type: Number,
        min: [1, "Must be at least 1 minute."],
        required: [true, "Duration In Minutes is required."],
    },

    originalLanguage: {
        type: String,
        maxlength: [10, "Must be 10 characters or less."],
        required: true,
    },

    country: {
        type: String,
        maxlength: [150, "Must be 150 characters or less."],
        required: true,
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
    },

    trailerURL: {
        type: String,
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