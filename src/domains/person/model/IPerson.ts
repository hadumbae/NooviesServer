import {Types} from "mongoose";
import type ICloudinaryImage from "../../../shared/interfaces/ICloudinaryImage.js";

export interface IPerson {
    readonly _id: Types.ObjectId,
    name: string,
    biography: string,
    dob: Date,
    nationality: string,
    profileImage?: ICloudinaryImage | null,
}

