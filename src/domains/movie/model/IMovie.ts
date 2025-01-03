import {Types} from "mongoose";
import type {IPerson} from "../../person/model/IPerson.js";
import type IGenre from "../../genre/model/IGenre.js";
import type IShowing from "../../showing/model/IShowing.js";
import type ICloudinaryImage from "../../../shared/interfaces/ICloudinaryImage.js";

export default interface IMovie {
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
    posterImage: ICloudinaryImage | null,
    trailerURL: string | null,
    price: number,
    showings: (Types.ObjectId | IShowing)[],
}

