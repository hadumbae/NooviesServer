import {Types} from "mongoose";
import type {IPerson} from "../../person/model/IPerson.js";
import type IGenre from "../../genre/model/IGenre.js";
import type IShowing from "../../showing/model/IShowing.js";
import type ICloudinaryImage from "../../../shared/interfaces/ICloudinaryImage.js";

export default interface IMovie {
    readonly _id: Types.ObjectId,
    // title
    title: string,
    // * originalTitle
    originalTitle: string,
    // * tagline
    tagline?: string,
    // * country
    country: string,
    // description => synopsis
    synopsis: string,
    // genres
    genres: (Types.ObjectId | IGenre)[],
    // directors => staff
    staff: (Types.ObjectId | IPerson)[],
    // cast
    cast: (Types.ObjectId | IPerson)[],
    // releaseDate
    releaseDate?: string | null,
    // durationInMinutes => runtime
    runtime: number,
    // * originalLanguage
    originalLanguage: string,
    // languages
    languages: string[],
    // subtitles
    subtitles: string[],
    // posterImage
    posterImage?: ICloudinaryImage | null,
    // trailerURL
    trailerURL?: string | null,
    // showings
    showings: (Types.ObjectId | IShowing)[],
}

