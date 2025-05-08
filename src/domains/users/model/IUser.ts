import {Types} from "mongoose";
import type IMovie from "../../movie/model/IMovie.js";

export default interface IUser {
    readonly _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    favourites: (Types.ObjectId | IMovie)[];
}