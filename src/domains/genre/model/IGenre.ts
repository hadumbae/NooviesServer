import {Types} from "mongoose";
import type IMovie from "../../movie/model/IMovie.js";

export default interface IGenre {
    readonly _id: Types.ObjectId;
    name: string;
    description: string;
    movies: (Types.ObjectId | IMovie)[];
}

