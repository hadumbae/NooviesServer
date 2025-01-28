import {Types} from "mongoose";
import type {IScreen} from "../../screen/model/IScreen.js";
import type ITheatre from "../../theatre/model/ITheatre.js";
import type ISeatMap from "../../seatmap/model/ISeatMap.js";
import type IMovie from "../../movie/model/IMovie.js";

export default interface IShowing {
    readonly _id: Types.ObjectId,

    startTime: Date,
    endTime?: Date | null,
    ticketPrice: number,
    language: string,
    subtitleLanguages: string[],
    isSpecialEvent?: boolean,

    movie: Types.ObjectId | IMovie,
    theatre: Types.ObjectId | ITheatre,
    screen: Types.ObjectId | IScreen,
    seating: ISeatMap[],

    wasNew?: boolean,
}