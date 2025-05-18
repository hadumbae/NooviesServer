import {Types} from "mongoose";
import type IGenre from "../../genre/model/IGenre.js";
import type IShowing from "../../showing/model/IShowing.js";
import type ICloudinaryImage from "../../../shared/interfaces/ICloudinaryImage.js";
import type {IMovieCredit} from "../../movieCredit/models/IMovieCredit.js";

export default interface IMovie {
    readonly _id: Types.ObjectId,
    title: string,
    originalTitle: string,
    tagline?: string,
    country: string,
    synopsis: string,
    genres: (Types.ObjectId | IGenre)[],
    crew?: IMovieCredit[],
    cast?: IMovieCredit[],
    releaseDate?: string | null,
    runtime: number,
    originalLanguage: string,
    languages: string[],
    subtitles: string[],
    posterImage?: ICloudinaryImage | null,
    trailerURL?: string | null,
    showings: (Types.ObjectId | IShowing)[],
}

