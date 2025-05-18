import {Types} from "mongoose";
import type ICloudinaryImage from "../../../shared/interfaces/ICloudinaryImage.js";
import type {IMovieCredit} from "../../movieCredit/models/IMovieCredit.js";

export interface IPerson {
    readonly _id: Types.ObjectId,
    name: string,
    biography: string,
    dob: Date,
    nationality: string,
    profileImage?: ICloudinaryImage | null,
    movies?: IMovieCredit[],
}

