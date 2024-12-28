import {Types} from "mongoose";
import type {IMovie} from "../../movie/model/MovieModel.js";

export interface IGenre {
    readonly _id: Types.ObjectId;
    name: string;
    description: string;
    movies: (Types.ObjectId | IMovie)[];
}

export interface IGenreSubmit {
    name: string;
    description: string;
}