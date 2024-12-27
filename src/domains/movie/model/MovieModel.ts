import {
    Schema,
    Types,
    Model,
    model,
} from "mongoose";
import type {IGenre} from "../../genre/model/GenreModel.js";
import type {IPerson} from "../../person/model/PersonModel.js";
import type {IShowing} from "../../showing/model/ShowingModel.js";

interface IPosterImage {
    public_id: string,
    secure_url: string,
}

export interface IMovie {
    readonly _id: Types.ObjectId,
    title: string,
    description: string,
    genres: (Types.ObjectId | IGenre)[],
    directors: (Types.ObjectId | IPerson)[],
    cast: (Types.ObjectId | IPerson)[],
    releaseDate?: Date | null,
    durationInMinutes: number,
    languages: string[],
    subtitles: string[],
    posterImage?: IPosterImage | null,
    trailerURL?: string | null,
    price: number,
    showings: (Types.ObjectId | IShowing)[],
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
        validate: (langs: any) => Array.isArray(langs) && langs.length > 0,
    },

    subtitles: {
        type: [String],
        required: true,
        validate: (subs: any) => Array.isArray(subs) && subs.length > 0,
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
        type: [Schema.Types.ObjectId],
        ref: "Showtime",
        required: true,
    },
}, {timestamps: true});

const Movie: Model<IMovie> = model<IMovie>("Movie", MovieSchema);
export default Movie;