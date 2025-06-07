import {Types} from "mongoose";
import type ICloudinaryImage from "../../../shared/interfaces/ICloudinaryImage.js";
import type {IMovieCredit} from "../../movieCredit/models/IMovieCredit.js";
import type {ISO3166Alpha2Code} from "../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";
import type {DateString} from "../../../shared/schema/date/DateStringSchema.js";

export interface IPerson {
    readonly _id: Types.ObjectId,
    name: string,
    biography: string,
    dob: DateString,
    nationality: ISO3166Alpha2Code,
    profileImage?: ICloudinaryImage | null,
    movies?: IMovieCredit[],
}

