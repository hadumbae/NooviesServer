import {Types} from "mongoose";
import type {SeatType} from "../schema/enum/SeatTypeEnum.js";
import type ITheatre from "../../theatre/model/ITheatre.js";
import type {IScreen} from "../../screen/model/IScreen.js";

export default interface ISeat {
    readonly _id: Types.ObjectId,
    row: string,
    seatNumber: string,
    seatType: SeatType,
    isAvailable: boolean,
    priceMultiplier: number,

    screen: Types.ObjectId | IScreen,
    theatre: Types.ObjectId | ITheatre,
}