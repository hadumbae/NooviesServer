import { Types } from "mongoose";
import type IMovie from "../../movie/model/IMovie.js";
import type {IPerson} from "../../person/model/IPerson.js";

export interface IMovieCredit {
    readonly _id: Types.ObjectId;
    movie: Types.ObjectId | IMovie;
    person: Types.ObjectId | IPerson;
    roleType: "CAST" | "CREW";
    notes?: string;

    // Crew
    job?: string;

    // Cast
    characterName?: string;
    billingOrder?: number;

    // Boolean Flags
    uncredited?: boolean;
    voiceOnly?: boolean;
    cameo?: boolean;
    motionCapture?: boolean;
}