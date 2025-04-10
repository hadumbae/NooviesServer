import {Types} from "mongoose";
import type {ScreenTypeEnumType} from "../schema/enum/ScreenTypeEnum.js";
import type ISeat from "../../seat/model/ISeat.js";
import type ITheatre from "../../theatre/model/ITheatre.js";
import type IShowing from "../../showing/model/IShowing.js";

export interface IScreen {
    readonly _id: Types.ObjectId,
    name: string,
    capacity: number,
    screenType: ScreenTypeEnumType,
    theatre: Types.ObjectId | ITheatre,
    seats: (Types.ObjectId | ISeat)[],
    showings: (Types.ObjectId | IShowing)[],
}

