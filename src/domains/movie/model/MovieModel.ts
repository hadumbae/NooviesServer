import {
    Schema,
    Types,
    Model,
    model,
} from "mongoose";

import type {IShowing} from "../../showing/model/ShowingInterfaces.js";
import type {IPerson} from "../../person/model/PersonInterfaces.js";
import type {IGenre} from "../../genre/model/GenreInterfaces.js";

interface IPosterImage {
    public_id: string,
    secure_url: string,
}

export interface IMovie {
    readonly _id?: Types.ObjectId | string,
    title: string,
    description: string,
    genres: (Types.ObjectId | string | IGenre)[],
    directors?: (Types.ObjectId | string | IPerson)[],
    cast?: (Types.ObjectId | string | IPerson)[],
    releaseDate?: Date | null,
    durationInMinutes: number,
    languages?: string[],
    subtitles?: string[],
    posterImage?: IPosterImage | null,
    trailerURL?: string | null,
    price: number,
    showings?: (Types.ObjectId | string | IShowing)[],
}

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
        required: [true, "Title is required."],
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
        type: [{type: Schema.Types.ObjectId, ref: "Showtime"}],
        required: true,
    },
}, {timestamps: true});

const Movie: Model<IMovie> = model<IMovie>("Movie", MovieSchema);
export default Movie;