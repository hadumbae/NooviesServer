import {Types} from "mongoose";
import type {IMovie} from "../../movie/model/MovieModel.js";

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

export interface IPersonSubmit {
    name: string,
    biography: string,
    dob: Date,
    nationality: string,
}