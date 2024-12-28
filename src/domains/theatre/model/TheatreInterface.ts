import {Types} from "mongoose";
import type {ISeat} from "../../seat/model/SeatModel.interfaces.js";
import type {IScreen} from "../../screen/model/ScreenModel.interfaces.js";

export interface ITheatreBase {
    name: string,
    location: string,
    numberOfSeats: number,
}

export interface ITheatreSubmit extends ITheatreBase {
    screens: string[],
    seats: string[],
}

export interface ITheatre extends ITheatreBase {
    _id: Types.ObjectId,
    screens: (Types.ObjectId | IScreen)[],
    seats: (Types.ObjectId | ISeat)[],
}