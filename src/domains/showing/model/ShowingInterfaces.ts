import {Types} from "mongoose";
import type {ISeat} from "../../seat/model/SeatModel.interfaces.js";
import type {IMovie} from "../../movie/model/MovieModel.js";
import type {ITheatre} from "../../theatre/model/TheatreInterface.js";
import type {IScreen} from "../../screen/model/ScreenModel.interfaces.js";

export interface ISeatMap {
    readonly _id?: Types.ObjectId | string;
    isAvailable?: boolean,
    price: number,
    seat: Types.ObjectId | string | ISeat,
}

export interface IShowing {
    readonly _id?: Types.ObjectId | string,

    startTime: Date,
    endTime?: Date | null,
    ticketPrice: number,
    language: string,
    subtitleLanguages: string[],
    isSpecialEvent?: boolean,

    movie: Types.ObjectId | string | IMovie,
    theatre: Types.ObjectId | string | ITheatre,
    screen: Types.ObjectId | string | IScreen,
    seatMap: ISeatMap[],
}