import {Schema, Types, model, type Model} from "mongoose";
import type {IMovie} from "../../movie/model/MovieModel.js";

// TODO Add Awards and Nominations

interface IPersonProfilePicture {
    public_id: string,
    secure_url: string,
}

export interface IPerson {
    readonly _id: Types.ObjectId,
    name: string,
    biography: string,
    dob: Date,
    nationality: string,
    profileImage?: IPersonProfilePicture,
    movies: (Types.ObjectId | IMovie)[],
}

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