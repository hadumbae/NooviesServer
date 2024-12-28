import {Types} from "mongoose";
import type {ScreenTypeEnumType} from "../schema/enum/ScreenTypeEnum.js";
import type {ISeat} from "../../seat/model/SeatModel.interfaces.js";
import type {ITheatre} from "../../theatre/model/TheatreInterface.js";

// Attributes
// _id
// theatre
// seats
// name
// capacity
// screenType

export interface IScreenBase {
    name: string,
    capacity: number,
    screenType: ScreenTypeEnumType,
}

export interface IScreenSubmit extends IScreenBase{
    theatre: string,
    seats: string[],
}

export interface IScreen extends IScreenBase {
    readonly _id: Types.ObjectId,
    theatre: Types.ObjectId | ITheatre,
    seats: (Types.ObjectId | ISeat)[],
}